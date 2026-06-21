import toast from "react-hot-toast";

const notify = (message) =>
  toast(message, {
    duration: 2000,
    position: "top-center",
  });

export default notify