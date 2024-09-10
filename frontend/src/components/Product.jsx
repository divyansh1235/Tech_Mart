import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { isMobile } from "react-device-detect";

const Product = ({ product }) => {
  return (
    <Card
      className={isMobile ? "my-1 p-2" : "my-2 p-2"}
      style={
        isMobile
          ? {
              boxShadow:
                "rgba(0, 0, 0, 0.25) 0px 5px 14px, rgba(0, 0, 0, 0.19) 0px 10px 10px",
              borderWidth: "0",
            }
          : {
              boxShadow:
                "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.19) 0px 10px 10px",
              borderWidth: "0",
            }
      }
    >
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title
            as="div"
            className="product-title"
            style={{ marginBottom: "0px" }}
          >
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as="h5">₹{product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
