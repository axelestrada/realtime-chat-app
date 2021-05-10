import { IonIcon, IonPage } from "@ionic/react";
import { Drivers, Storage } from "@ionic/storage";
import { useHistory, useLocation } from "react-router";
import { Fragment, useEffect, useRef, useState } from "react";

import axios from "axios";
import moment from "moment";
import { io } from "socket.io-client";

import Loader from "../components/Loader";

import Logo from "../assets/images/chatbitLogoIcon.jpg";
import { chevronBack, informationCircleOutline } from "ionicons/icons";

import config from "../config.json";
import ErrorDialog from "../components/ErrorDialog";

const socket = io(config.SERVER_URL);

const storage = new Storage({
  name: "__localDb",
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
});

storage.create();

function Chat() {
  const history = useHistory();
  const location = useLocation();

  const messagesEndRef = useRef(null);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  let currentDate = "";
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const audio = new Audio(`${config.SERVER_URL}/sounds/new-message.ogg`);

  const addContact = async (id) => {
    const token = await storage.get("token");

    axios
      .put(
        `${config.SERVER_URL}/home/add-contact`,
        {
          userId: id,
        },
        {
          headers: {
            token,
          },
        }
      )
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
  };

  const readMessages = async (msgId = "") => {
    const token = await storage.get("token");

    await axios
      .put(
        `${config.SERVER_URL}/home/read-messages`,
        {
          userId: location.state && location.state.userId,
          msgId,
        },
        {
          headers: {
            token,
          },
        }
      )
      .then(() => {
        getMessages();
      })
      .catch((err) => {
        setError(true);
        console.error(err);
      });
  };

  const getMessages = async () => {
    const token = await storage.get("token");

    await axios
      .get(`${config.SERVER_URL}/home/get-messages`, {
        headers: {
          token,
        },
        params: {
          outgoingMsgId: location.state && location.state.userId,
        },
      })
      .then((res) => {
        if (res.data.messages) {
          setMessages(res.data.messages);

          if (messagesEndRef.current && messagesEndRef.current.scrollIntoView) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
          }
        } else {
          setMessages([]);
        }
      })
      .catch((err) => {
        setError(true);
        console.error(err);
      });

    setShowLoader(false);
  };

  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (message) {
      const userId = await storage.get("userId");

      const msg = {
        incomingMsgId: location.state && location.state.userId,
        outgoingMsgId: userId,
        msg: message,
        date: new Date(),
      };

      setMessages((msgs) => [...msgs, msg]);
      setMessage("");

      socket.emit("message", msg);

      if (messagesEndRef.current && messagesEndRef.current.scrollIntoView) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleMessage = async (msg) => {
    const userId = await storage.get("userId");

    if (
      msg.incomingMsgId === userId &&
      msg.outgoingMsgId === location.state.userId
    ) {
      audio.play();

      setMessages((msgs) => [...msgs, msg]);

      if (messagesEndRef.current && messagesEndRef.current.scrollIntoView) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }

      readMessages(msg._id);
    }
  };

  useEffect(() => {
    if (location.pathname === "/home/chat") {
      setShowLoader(true);

      readMessages();

      if (location.state && location.state.userId) {
        addContact(location.state.userId);
      }

      socket.on("message", handleMessage);
    }

    return () => {
      socket.off("message", handleMessage);
    };
  }, [location]); //eslint-disable-line

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

            readMessages();
          }}
        />
        <Loader visible={showLoader} src={Logo} />
        <div className="chat-page w-full h-full max-w-sm m-auto bg-gray-100">
          <div className="chat-page__header p-5 flex justify-between items-center">
            <IonIcon
              className="icon"
              src={chevronBack}
              onClick={() => {
                history.goBack();
                setMessages([]);
              }}
            />
            <h1 className="text-2xl">
              {location.state && location.state.userName}
            </h1>
            <IonIcon className="icon" src={informationCircleOutline} />
          </div>

          <div className="chat-page__messages bg-white p-5 pb-0 max-h-full overflow-y-scroll">
            {messages.map((message, idx) => {
              let date = new Date(message.date);
              let myDate = new Date();
              let groupDate = moment().diff(date, "minutes");

              groupDate =
                groupDate <= 1440 && date.getDay() === myDate.getDay()
                  ? "Today"
                  : groupDate <= 2880 && date.getDay() === myDate.getDay() - 1
                  ? "Yesterday"
                  : months[date.getMonth()] +
                    " " +
                    date.getDate() +
                    ", " +
                    date.getFullYear();

              if (groupDate !== currentDate) {
                currentDate = groupDate;

                return (
                  <Fragment key={idx}>
                    <div className="group-date">{groupDate}</div>
                    <Message
                      type={
                        location.state &&
                        location.state.userId === message.incomingMsgId
                          ? "outgoing"
                          : "incoming"
                      }
                      content={message.msg}
                      date={formatAMPM(date)}
                    />
                  </Fragment>
                );
              }

              return (
                <Message
                  key={idx}
                  type={
                    location.state &&
                    location.state.userId === message.incomingMsgId
                      ? "outgoing"
                      : "incoming"
                  }
                  content={message.msg}
                  date={formatAMPM(date)}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-page__message-box bg-white p-5">
            <form
              onSubmit={sendMessage}
              className="input-box px-2 py-4 rounded-2xl"
            >
              <input
                type="text"
                autoComplete="off"
                placeholder="Message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit">
                <svg
                  className="icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <linearGradient id="gradient">
                    <stop stopColor="#6388FD" offset="0%" />
                    <stop stopColor="#4BD2E7" offset="100%" />
                  </linearGradient>
                  <path
                    fill="url(#gradient)"
                    d="M476.59 227.05l-.16-.07L49.35 49.84A23.56 23.56 0 0027.14 52 24.65 24.65 0 0016 72.59v113.29a24 24 0 0019.52 23.57l232.93 43.07a4 4 0 010 7.86L35.53 303.45A24 24 0 0016 327v113.31A23.57 23.57 0 0026.59 460a23.94 23.94 0 0013.22 4 24.55 24.55 0 009.52-1.93L476.4 285.94l.19-.09a32 32 0 000-58.8z"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </IonPage>
  );
}

function Message({ type, content, date }) {
  return (
    <div className={`message ${type}`}>
      <div className="content">{content}</div>
      <span>{date}</span>
    </div>
  );
}

export default Chat;
