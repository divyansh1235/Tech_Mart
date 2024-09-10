import { useState } from "react";
import { Button, Form, FormControl } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyWord: urlKeyWord } = useParams();
  const [keyWord, setKeyWord] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyWord.trim()) {
      setKeyWord("");
      navigate(`/search/${keyWord}`);
    } else {
      navigate("/");
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <FormControl
        type="text"
        name="q"
        onChange={(e) => setKeyWord(e.target.value)}
        value={keyWord}
        placeholder="Search products..."
        className="mr-sm-2 ml-sm-5"
      ></FormControl>
      <Button type="submit" variant="outline-light" className="p-2 me-4 ms-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
