import { Spinner } from "react-bootstrap";
import { FaOpencart } from "react-icons/fa";

const Loader = () => {
  return (
    <>
      <Spinner
        animation="grow"
        role="status"
        variant="secondary"
        style={{
          width: "100px",
          height: "100px",
          margin: "auto",
          display: "block",
        }}
      >
        <FaOpencart
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            fontSize: "50px",
            color: "white",
            transform: "translate(-50%, -50%)",
          }}
        ></FaOpencart>
      </Spinner>
    </>
  );
};

export default Loader;
