import {
  IonContent,
  IonHeader,
  IonPage,
  IonRouterLink,
  IonTitle,
  IonToolbar,
  IonCard,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import { Drivers, Storage } from "@ionic/storage";
import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { io } from "socket.io-client";

const socket = io("https://realtime-chat-siwi.herokuapp.com/", {
  autoConnect: false,
});

const Home = () => {
  const [users, setUsers] = useState([
    {
      name: "",
    },
  ]);

  const latestUsers = (users) => {
    setUsers(users);
  };

  const addUser = (user) => {
    setUsers((oldUsers) => [
      ...oldUsers,
      ...(Array.isArray(user) ? user.reverse() : [user]),
    ]);
  };

  useEffect(() => {
    socket.on("latestUsers", (data) => {
      latestUsers(data);
    });

    socket.on("user", (user) => {
      addUser(user);
    });

    socket.connect();
  }, []);

  const location = useLocation();

  const [userInfo, setUserInfo] = useState({});

  const storage = new Storage({
    name: "__localDb",
    driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
  });
  storage.create();

  async function getFLS() {
    const token = await storage.get("facebookToken");
    const userId = await storage.get("facebookUserId");

    const response = await fetch(
      `https://graph.facebook.com/${userId}?fields=id,name,gender,link,picture&type=large&access_token=${token}`
    );
    const myJson = await response.json();

    if (!myJson.error) {
      setUserInfo({
        picture: myJson.picture.data.url,
        name: myJson.name,
      });
    }
  }

  useEffect(() => {
    if (location.pathname === "/home") {
      console.log(location.state);
    }
  }, [location]); // eslint-disable-line

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle>Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer />
        <IonRouterLink routerLink="/login">Login</IonRouterLink>
        <IonCard>
          {users.map((user, index) => {
            console.log(users);
            return user.name;
          })}
        </IonCard>
      </IonContent>
    </IonPage>
  );
};;

export default Home;
