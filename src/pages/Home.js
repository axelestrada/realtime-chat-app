import { IonPage } from "@ionic/react";
import { useHistory } from "react-router";
import { Plugins } from "@capacitor/core";
import { useEffect, useState } from "react";
import { Drivers, Storage } from "@ionic/storage";
import { Twitter } from "@capacitor-community/twitter";

import axios from "axios";
import moment from "moment";
import { io } from "socket.io-client";

import Loader from "../components/Loader";
import Header from "../components/Header";
import HomeFooter from "../components/HomeFooter";
import ErrorDialog from "../components/ErrorDialog";

import Logo from "../assets/images/chatbitLogoIcon.jpg";
import defaultUser from "../assets/images/defaultUser.jpg";

import config from "../config.json";

const twitter = new Twitter();

const socket = io(config.SERVER_URL);

const storage = new Storage({
  name: "__localDb",
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
});

storage.create();

function isUrl(value) {
  var regexp =
    /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  return regexp.test(value);
}

const Home = () => {
  const history = useHistory();

  const [error, setError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeChats, setActiveChats] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const getLastTime = (date) => {
    let lastTime = moment(date).fromNow(true);

    lastTime = lastTime.split(" ");

    switch (lastTime[0]) {
      case "a":
      case "an":
        lastTime[0] = "1";
        break;
      default:
        break;
    }

    switch (lastTime[1]) {
      case "few":
        lastTime[0] = "A";
        lastTime[2] = "sec";
        break;
      case "seconds":
        lastTime[1] = "sec";
        break;
      case "minute":
      case "minutes":
        lastTime[1] = "min";
        break;
      default:
        break;
    }

    return lastTime.join(" ");
  };

  const latestMessages = async (loader) => {
    if (loader === "si") setShowLoader(true);

    const token = await storage.get("token");

    await axios
      .get(`${config.SERVER_URL}/home/latest-messages`, {
        headers: {
          token,
        },
      })
      .then((res) => {
        if (res.data.latestMessages) setActiveChats(res.data.latestMessages);
      })
      .catch((err) => {
        setError(true);
        console.error(err);
      });

    setShowLoader(false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      latestMessages();
    }, 60000);

    return () => clearTimeout(timeout);
  }, [activeChats]);

  useEffect(() => {
    setSearchResults(
      activeChats.filter(
        (chat) =>
          chat.contactInfo.name
            .toLowerCase()
            .indexOf(searchValue.toLowerCase()) > -1
      )
    );
  }, [searchValue]); //eslint-disable-line

  useEffect(() => {
    latestMessages("si");
    socket.on("message", latestMessages);

    return () => {
      socket.off("message", latestMessages);
    };
  }, []); //eslint-disable-line

  return (
    <IonPage>
      <div className="w-full h-full bg-gray-100">
        <ErrorDialog
          visible={error}
          setVisible={setError}
          title="Error!"
          subtitle="Something went wrong!"
          buttonTitle="Try Again"
          onClick={() => {
            setError(false);

            latestMessages("si");
          }}
        />
        <Loader visible={showLoader} src={Logo} />
        <div className="home w-full h-full max-w-sm m-auto bg-gray-100">
          <Header
            title="Chatbit"
            value={searchValue}
            setValue={setSearchValue}
            placeholder="Search by name"
            toggleOnClick={() => setShowMenu(!showMenu)}
          >
            <div
              className={`header__menu absolute top-0 right-0 p-5 bg-white mt-10 transition-opacity duration-500 ${
                showMenu ? "opacity-100" : "opacity-0"
              }`}
            >
              <ul>
                <li>
                  <button>Profile</button>
                </li>
                <li>
                  <button
                    onClick={async () => {
                      await storage.remove("token");
                      await storage.remove("userId");

                      await twitter.logout();
                      await Plugins.FacebookLogin.logout();
                      await Plugins.GoogleAuth.signOut();

                      history.push("/login");
                    }}
                  >
                    Logout
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      Plugins.App.exitApp();
                    }}
                  >
                    Exit
                  </button>
                </li>
              </ul>
            </div>
          </Header>

          <div className="home__chats p-5 max-h-full overflow-y-auto">
            {searchValue !== ""
              ? searchResults.map((chat, idx) => {
                  const lastTime = getLastTime(
                    chat.latestMessage && chat.latestMessage.date
                  );

                  return (
                    <Chat
                      key={idx}
                      userId={chat.contactInfo && chat.contactInfo._id}
                      userName={chat.contactInfo && chat.contactInfo.name}
                      latestMessage={
                        chat.latestMessage && chat.latestMessage.msg
                      }
                      lastTime={lastTime}
                      profilePicture={
                        chat.contactInfo && chat.contactInfo.picture
                      }
                      unreadMessages={chat.contactInfo && chat.unreadMessages}
                    />
                  );
                })
              : activeChats.map((chat, idx) => {
                  const lastTime = getLastTime(
                    chat.latestMessage && chat.latestMessage.date
                  );

                  return (
                    <Chat
                      key={idx}
                      userId={chat.contactInfo && chat.contactInfo._id}
                      userName={chat.contactInfo && chat.contactInfo.name}
                      latestMessage={
                        chat.latestMessage && chat.latestMessage.msg
                      }
                      lastTime={lastTime}
                      profilePicture={
                        chat.contactInfo && chat.contactInfo.picture
                      }
                      unreadMessages={chat.contactInfo && chat.unreadMessages}
                    />
                  );
                })}
          </div>
          <HomeFooter lastConversation={activeChats[0]} />
        </div>
      </div>
    </IonPage>
  );
};

function Chat({
  userId,
  profilePicture,
  userName,
  latestMessage,
  lastTime,
  unreadMessages,
}) {
  const history = useHistory();

  return (
    <div
      className="chat mb-5"
      onClick={() => {
        history.push("/home/chat", { userId, userName });
      }}
    >
      <img
        className="picture rounded-full object-cover"
        src={
          isUrl(profilePicture)
            ? profilePicture
            : profilePicture
            ? `${config.SERVER_URL}${profilePicture}`
            : defaultUser
        }
        onError={(e) => {
          e.target.src = defaultUser;
        }}
        alt="People"
      />
      <div className="mx-2">
        <h2 className="name text-lg">{userName}</h2>
        <h5 className="msg-content">{latestMessage}</h5>
      </div>
      <div className="text-right">
        <p className="last-time mb-2">{lastTime}</p>
        <span
          className={`${
            unreadMessages ? "inline-block" : "hidden"
          } unread text-center h-5 px-1 text-sm rounded-md`}
        >
          {unreadMessages}
        </span>
      </div>
    </div>
  );
}

export default Home;
