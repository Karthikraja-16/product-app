import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "./redux/categorySlice";
import { fetchProducts, clearProducts } from "./redux/productSlice";
import {
  Select,
  Input,
  Button,
  Spin,
  Row,
  Col,
  Card,
  Typography,
  Divider,
} from "antd";
import { useSearchParams } from "react-router-dom";
import "./App.css";

const { Text, Title } = Typography;

function App() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.items);
  const products = useSelector((state) => state.products.items);
  const totalProducts = useSelector((state) => state.products.totalProducts); // Get total products
  const status = useSelector((state) => state.products.status);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCategory = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(clearProducts());
    dispatch(
      fetchProducts({
        category: selectedCategory,
        limit: 10,
        skip: 0,
        search: searchQuery, // Ensure the search query is passed here
      })
    );
  }, [dispatch, selectedCategory, searchQuery]);

  const handleCategoryChange = (value) => {
    setSearchParams({ category: value, search: searchQuery });
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (value) => {
    setSearchParams({ category: selectedCategory, search: value });
    setSearchQuery(value); // Update the searchQuery state with the new value
  };

  const loadMore = () => {
    dispatch(
      fetchProducts({
        category: selectedCategory,
        limit: 10,
        skip: products.length,
        search: searchQuery,
      })
    );
  };

  return (
    <div className="app-container">
      <Title level={2} className="app-title">
        Product Finder
      </Title>

      <div className="search-filters-container">
        <Select
          style={{ width: 250 }}
          placeholder="Select Category"
          onChange={handleCategoryChange}
          value={selectedCategory || undefined}
          className="category-select"
        >
          <Select.Option value="">All Categories</Select.Option>
          {categories.map((category, index) => (
            <Select.Option key={index} value={category.slug}>
              {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
            </Select.Option>
          ))}
        </Select>

        <Input.Search
          style={{ width: 350, marginLeft: 20 }}
          placeholder="Search products"
          enterButton="Search"
          size="large"
          onSearch={handleSearch}
          className="search-input"
          value={searchQuery}
          onChange={handleInputChange}
        />
      </div>

      <Divider />

      {status === "loading" && (
        <Spin size="large" className="loading-spinner" />
      )}

      <Row gutter={[24, 24]} className="products-grid">
        {products.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={
                <img
                  alt={product.title}
                  src={product.thumbnail}
                  className="product-image"
                />
              }
              className="product-card"
            >
              <Card.Meta
                title={<Text strong>{product.title}</Text>}
                description={
                  <>
                    <Text type="secondary">${product.price}</Text>
                    <br />
                    <Text type="secondary" ellipsis>
                      {product.description}
                    </Text>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {totalProducts > products.length && products.length > 0 && (
        <div className="load-more-container">
          <Button
            type="primary"
            onClick={loadMore}
            size="large"
            className="load-more-btn"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

export default App;
