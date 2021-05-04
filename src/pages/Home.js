import { IonPage, IonIcon } from "@ionic/react";
import { Drivers, Storage } from "@ionic/storage";
import {
  search,
} from "ionicons/icons";
import { useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

import defaultUser from "../assets/images/defaultUser.jpg";
import "../styles/css/min/Home.min.css";
import HomeFooter from "../components/HomeFooter";

const socket = io("http://192.168.0.106:3300", {
  autoConnect: false,
});

const storage = new Storage({
  name: "__localDb",
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
});

storage.create();

const Home = () => {
  const latestMessages = async () => {
    const token = await storage.get("token");

    axios
      .get("http://192.168.0.106:3300/home/latest-messages", {
        headers: {
          token,
        },
      })
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    latestMessages();

    socket.connect();
  }, []);

  return (
    <IonPage>
      <div className="w-full h-full bg-gray-100">
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
              <input type="text" name="search" placeholder="Search by name" />
            </div>
          </div>

          <div className="home__chats p-5 max-h-full overflow-y-auto">
            <Chat
              userName="Pamela Willis"
              latestMessage="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima et voluptatum pariatur accusamus repellat sint!"
              latestMessageDate="5 min"
              profilePicture="https://wipy.tv/wp-content/uploads/2020/09/nueva-imagen-de-black-widow.jpg"
            />
            <Chat
              userName="Nick Stewart"
              latestMessage="Lorem ipsum dolor sit amet consectetur adipisicing elit."
              latestMessageDate="12 min"
              unreadMessages="2"
              profilePicture="https://deathofhemingway.com/wp-content/uploads/2020/12/istockphoto-1045886560-612x612-1.jpg"
            />
            <Chat
              userName="Jasmine Grand"
              latestMessage="Lorem ipsum dolor sit."
              latestMessageDate="25 min"
              unreadMessages="1"
              profilePicture="https://i.pinimg.com/originals/97/ed/6b/97ed6b370803649addbf66144c18c194.png"
            />
            <Chat
              userName="Barbara Matthews"
              latestMessage="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore!"
              latestMessageDate="3 hours"
            />
          </div>

          <HomeFooter />
        </div>
      </div>
    </IonPage>
  );
};

function Chat({
  profilePicture,
  userName,
  latestMessage,
  latestMessageDate,
  unreadMessages,
}) {
  return (
    <div className="chat pb-3">
      <img
        className="rounded-full object-cover"
        src={profilePicture ? profilePicture : defaultUser}
        alt="People"
      />
      <div>
        <h2 className="text-lg">{userName}</h2>
        <h5>{latestMessage}</h5>
      </div>
      <div className="text-right">
        <p className="mb-2">{latestMessageDate}</p>
        <span
          className={`${
            unreadMessages ? "inline-block" : "hidden"
          } text-center w-5 h-5 text-sm rounded-md`}
        >
          {unreadMessages}
        </span>
      </div>
    </div>
  );
}

export default Home;
