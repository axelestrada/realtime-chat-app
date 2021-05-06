import { IonIcon, IonPage } from "@ionic/react";
import { chatboxOutline, search } from "ionicons/icons";
import HomeFooter from "../components/HomeFooter";

import defaultUser from "../assets/images/defaultUser.jpg";
import { useHistory } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

import { Drivers, Storage } from "@ionic/storage";

import { formatPhoneNumber } from "react-phone-number-input";

const storage = new Storage({
  name: "__localDb",
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
});

storage.create();

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const searchContacts = async () => {
    const token = await storage.get("token");

    axios
      .get("http://192.168.0.106:3300/home/search-contacts", {
        headers: {
          token,
        },
        params: {
          searchValue,
        },
      })
      .then((res) => {
        if (res.data.users) {
          setContacts(res.data.users);
        } else {
          setContacts([]);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getContacts = async () => {
    const token = await storage.get("token");

    axios
      .get("http://192.168.0.106:3300/home/contacts", {
        headers: {
          token,
        },
      })
      .then((res) => {
        if (res.data.users) {
          setContacts(res.data.users);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (searchValue) {
      searchContacts();
    } else {
      getContacts();
    }
  }, [searchValue]); //eslint-disable-line

  return (
    <IonPage>
      <div className="w-full h-full bg-white">
        <div className="home w-full h-full max-w-sm m-auto bg-white relative">
          <div className="home__header p-5">
            <h1 className="text-3xl">Contacts</h1>

            <div className="home__search-box rounded-full mt-3 py-3 px-5">
              <IonIcon src={search} className="w-5 h-5 grid" />
              <input
                type="text"
                autoComplete="off"
                name="search"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>
          <div className="home__contacts p-5 max-h-full overflow-y-auto rounded-t-3xl bg-gray-100">
            {contacts.map((contact, index) => {
              return (
                <Contact
                  key={index}
                  userName={contact.name}
                  phoneNumber={
                    contact.phoneIntl
                      ? formatPhoneNumber(contact.phoneIntl)
                      : contact.email
                  }
                  profilePicture={contact.picture}
                  userId={contact._id}
                />
              );
            })}
          </div>
          <HomeFooter />
        </div>
      </div>
    </IonPage>
  );
}

function Contact({ profilePicture, userName, phoneNumber, userId }) {
  const history = useHistory();

  return (
    <div
      className="contact mb-3"
      onClick={() => {
        history.push("/home/chat", { userId, userName })}}
    >
      <div className="img-box">
        <img
          className="rounded-full object-cover"
          src={
            profilePicture
              ? `http://192.168.0.106:3300/${profilePicture}`
              : defaultUser
          }
          alt="People"
        />
      </div>
      <div>
        <h2 className="text-lg">{userName}</h2>
        <h5 className="text-sm">{phoneNumber}</h5>
      </div>
      <div className="text-right">
        <button>
          <IonIcon className="icon" src={chatboxOutline} />
        </button>
      </div>
    </div>
  );
}

export default Contacts;
