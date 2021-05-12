import { useEffect, useState } from "react";
import { IonIcon, IonPage } from "@ionic/react";
import { Drivers, Storage } from "@ionic/storage";
import { useHistory, useLocation } from "react-router";

import axios from "axios";
import { formatPhoneNumber } from "react-phone-number-input";

import Header from "../components/Header";
import HomeFooter from "../components/HomeFooter";
import ErrorDialog from "../components/ErrorDialog";

import { chatboxOutline } from "ionicons/icons";
import defaultUser from "../assets/images/defaultUser.jpg";

import config from "../config.json";

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

function Contacts() {
  const location = useLocation();

  const [error, setError] = useState("");
  const [contacts, setContacts] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const searchContacts = async () => {
    const token = await storage.get("token");

    axios
      .get(`${config.SERVER_URL}/home/search-contacts`, {
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
        setError("search");
        console.error(err);
      });
  };

  const getContacts = async () => {
    const token = await storage.get("token");

    axios
      .get(`${config.SERVER_URL}/home/contacts`, {
        headers: {
          token,
        },
      })
      .then((res) => {
        if (res.data.users) {
          setContacts(res.data.users);
        }else{
          setContacts([]);
        }
      })
      .catch((err) => {
        setError("get");
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
        <ErrorDialog
          visible={error}
          setVisible={setError}
          title="Error!"
          subtitle="Something went wrong!"
          buttonTitle="Try Again"
          onClick={() => {
            setError("");

            switch (error) {
              case "get":
                getContacts();
                break;
              case "search":
                searchContacts();
                break;
              default:
                break;
            }
          }}
        />
        <div className="contacts w-full h-full max-w-sm m-auto bg-white relative">
          <Header
            title="Contacts"
            value={searchValue}
            setValue={setSearchValue}
            placeholder="Search"
            showToggle={false}
          />
          <div className="contacts__users p-5 max-h-full overflow-y-auto rounded-t-3xl bg-gray-100">
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
          <HomeFooter
            lastConversation={location.state && location.state.lastConversation}
          />
        </div>
      </div>
    </IonPage>
  );
}

function Contact({ profilePicture, userName, phoneNumber, userId }) {
  const history = useHistory();

  return (
    <div
      className="user mb-5 overflow-hidden"
      onClick={() => {
        history.push("/home/chat", { userId, userName });
      }}
    >
      <img
        className="picture rounded-full object-cover"
        src={
          isUrl(profilePicture) ? profilePicture : profilePicture ? `${config.SERVER_URL}${profilePicture}` : defaultUser
        }
        onError={(e) => {
          e.target.src = defaultUser;
        }}
        alt="People"
      />
      <div className="mx-2 max-w-full overflow-hidden">
        <h2 className="name text-lg">{userName}</h2>
        <h5 className="contact-info overflow-ellipsis whitespace-nowrap overflow-hidden">
          {phoneNumber}
        </h5>
      </div>
      <div className="text-right">
        <button>
          <IonIcon className="icon w-6 h-6" src={chatboxOutline} />
        </button>
      </div>
    </div>
  );
}

export default Contacts;
