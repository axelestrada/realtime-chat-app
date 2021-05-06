import { IonPage, IonIcon } from "@ionic/react";
import { Drivers, Storage } from "@ionic/storage";
import { search } from "ionicons/icons";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

import defaultUser from "../assets/images/defaultUser.jpg";
import "../styles/css/min/Home.min.css";
import HomeFooter from "../components/HomeFooter";
import { useHistory, useLocation } from "react-router";

import moment from "moment";

import config from "../config.json";
import Loader from "../components/Loader";
import Logo from "../assets/images/chatbitLogoIcon.jpg";

const socket = io(config.SERVER_URL);

const storage = new Storage({
  name: "__localDb",
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
});

storage.create();

const Home = () => {
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeChats, setActiveChats] = useState([]);

  useEffect(() => {
    if (searchValue) {
      setSearchResults(
        activeChats.filter(
          (chat) =>
            chat.contactInfo.name
              .toLowerCase()
              .indexOf(searchValue.toLowerCase()) > -1
        )
      );
    } else {
      setSearchResults([]);
    }
  }, [searchValue]); //eslint-disable-line

  const latestMessages = async (loader) => {
    if (loader === "si") {
      setShowLoader(true);
    }

    const token = await storage.get("token");

    await axios
      .get(`${config.SERVER_URL}/home/latest-messages`, {
        headers: {
          token,
        },
      })
      .then((res) => {
        if (res.data.latestMessages) {
          setActiveChats(res.data.latestMessages);
        }
      })
      .catch((err) => {
        console.error(err);
      });

    setShowLoader(false);
  };

  useEffect(() => {
    if (location.pathname === "/home") {
      latestMessages("si");

      socket.on("message", latestMessages);
    }

    return () => {
      socket.off("message", latestMessages);
    };
  }, [location]); //eslint-disable-line

  return (
    <IonPage>
      <div className="w-full h-full bg-gray-100">
        <Loader visible={showLoader} src={Logo} />
        <div className="home w-full h-full max-w-sm m-auto bg-gray-100">
          <div className="home__header bg-white rounded-b-3xl p-5">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl">Chatbit</h1>
              <svg
                viewBox="0 0 134.775 134.775"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
              >
                <path
                  fill="currentColor"
                  d="M67.58 44.795c13.569 0 22.201-11.101 22.201-22.598C89.781 11.101 81.149 0 67.58 0 53.213 0 44.994 11.101 44.994 22.197c0 11.497 8.219 22.598 22.586 22.598zM67.58 134.775c13.569 0 22.201-11.101 22.201-22.602 0-11.101-8.632-22.193-22.201-22.193-14.367 0-22.586 11.093-22.586 22.193 0 11.502 8.219 22.602 22.586 22.602z"
                />
              </svg>
            </div>

            <div className="home__search-box rounded-full mt-3 py-3 px-5">
              <IonIcon src={search} className="w-5 h-5 grid" />
              <input
                autoComplete="off"
                type="text"
                name="search"
                placeholder="Search by name"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>

          <div className="home__chats p-5 max-h-full overflow-y-auto">
            {searchValue !== ""
              ? searchResults.map((chat, idx) => {
                  let latestDate = moment(
                    chat.latestMessage && chat.latestMessage.date
                  ).fromNow(true);
                  latestDate = latestDate.split(" ");
                  latestDate[0] =
                    latestDate[0] === "a" || latestDate[0] === "an"
                      ? "1"
                      : latestDate[0];
                  latestDate[1] =
                    latestDate[1] === "few"
                      ? "mom"
                      : latestDate[1] === "seconds"
                      ? "sec"
                      : latestDate[1] === "minute" ||
                        latestDate[1] === "minutes"
                      ? "min"
                      : latestDate[1];

                  return (
                    <Chat
                      key={idx}
                      userId={chat.contactInfo._id}
                      userName={chat.contactInfo.name}
                      latestMessage={
                        chat.latestMessage && chat.latestMessage.msg
                      }
                      latestMessageDate={latestDate[0] + " " + latestDate[1]}
                      profilePicture={chat.contactInfo.picture}
                      unreadMessages={chat.unreadMessages}
                    />
                  );
                })
              : activeChats.map((chat, idx) => {
                  let latestDate = moment(
                    chat.latestMessage && chat.latestMessage.date
                  ).fromNow(true);
                  latestDate = latestDate.split(" ");
                  latestDate[0] =
                    latestDate[0] === "a" || latestDate[0] === "an"
                      ? "1"
                      : latestDate[0];
                  latestDate[1] =
                    latestDate[1] === "few"
                      ? "mom"
                      : latestDate[1] === "seconds"
                      ? "sec"
                      : latestDate[1] === "minute" ||
                        latestDate[1] === "minutes"
                      ? "min"
                      : latestDate[1];

                  return (
                    <Chat
                      key={idx}
                      userId={chat.contactInfo._id}
                      userName={chat.contactInfo.name}
                      latestMessage={
                        chat.latestMessage && chat.latestMessage.msg
                      }
                      latestMessageDate={latestDate[0] + " " + latestDate[1]}
                      profilePicture={chat.contactInfo.picture}
                      unreadMessages={chat.unreadMessages}
                    />
                  );
                })}
          </div>
          <HomeFooter />
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
  latestMessageDate,
  unreadMessages,
}) {
  const history = useHistory();

  return (
    <div
      className="chat mb-3"
      onClick={() => {
        history.push("/home/chat", { userId, userName });
      }}
    >
      <img
        className="rounded-full object-cover"
        src={profilePicture ? config.SERVER_URL + profilePicture : defaultUser}
        alt="People"
      />
      <div className="mx-2 self-center">
        <h2 className="text-lg">{userName}</h2>
        <h5>{latestMessage}</h5>
      </div>
      <div className="text-right">
        <p className="mb-2">{latestMessageDate}</p>
        <span
          className={`${
            unreadMessages ? "inline-block" : "hidden"
          } text-center h-5 px-1 text-sm rounded-md`}
        >
          {unreadMessages}
        </span>
      </div>
    </div>
  );
}

export default Home;
