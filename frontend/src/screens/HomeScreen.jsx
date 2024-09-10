import { Row, Col } from "react-bootstrap";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link, useParams } from "react-router-dom";
import Paginate from "../components/Paginate";
import { isMobile } from "react-device-detect";
import { useEffect } from "react";

const HomeScreen = () => {
  const { pageNumber, keyWord } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    pageNumber,
    keyWord,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [data]);

  return (
    <>
      {keyWord && (
        <Link to="/" className="btn btn-light mb-2">
          Go Back
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h6 style={{ marginBottom: "0" }}>Latest Products</h6>
          <Row>
            {data.products.map((product) => (
              <Col
                key={product._id}
                style={isMobile ? { padding: "4px" } : { padding: "3px" }}
                xs={6}
                sm={6}
                md={4}
                lg={4}
                xl={2}
              >
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyWord={keyWord ? keyWord : ""}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
