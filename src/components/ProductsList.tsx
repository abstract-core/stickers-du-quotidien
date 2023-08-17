"use client";

import { PureBlocksRenderer } from "nebula-atoms";
import React, { useMemo, useState } from "react";
import { PageAndBlocks } from "../types/PageAndBlocks";
import { parseProduct } from "./_helpers/parseProduct";

export default function ProductsList({
  products,
}: {
  products: PageAndBlocks[];
}) {
  const [category, setCategory] = useState<false | string>(false);
  const _products = useMemo(
    () => products.map((product) => parseProduct(product)),
    [products]
  );
  const categories = useMemo(() => {
    const categories: string[] = [];
    _products.forEach(({ category }) => {
      if (category && !categories.includes(category)) {
        categories.push(category);
      }
    });
    return categories;
  }, [_products]);
  const displayedProducts = useMemo(() => {
    if (!category) {
      return _products;
    }
    return _products.filter(
      ({ category: _category }) => _category === category
    );
  }, [_products, category]);
  return (
    <div id="products-list">
      <div className="categories-filter">
        {categories.map((_category) => (
          <button
            key={_category}
            className={`btn me-2 mb-2 btn-${
              category === _category ? "light" : "peach"
            }`}
            onClick={() =>
              setCategory(category === _category ? false : _category)
            }
          >
            {_category}
          </button>
        ))}
      </div>
      {displayedProducts.map(
        ({
          title,
          imagePath,
          description,
          category,
          height,
          width,
          price,
          stripeLink,
          stripeLinkDelivery,
          blocks,
        }) => {
          return (
            <div className="product my-5" key={title}>
              <div className="product-thumbnail d-flex justify-content-center">
                {imagePath && (
                  <img src={imagePath} alt={description} loading="lazy" />
                )}
              </div>
              <div className="product-details">
                <h2>{title}</h2>
                <p className="product-category badge rounded-pill">
                  {category}
                </p>
                <PureBlocksRenderer blocks={blocks} />
                <p>
                  {height} x {width} cm - {price} €
                </p>
                <div className="product-links">
                  {stripeLink && (
                    <a className="btn btn-peach me-2 mb-2" href={stripeLink}>
                      Acheter sans livraison
                    </a>
                  )}
                  {stripeLinkDelivery && (
                    <a
                      className="btn btn-peach me-2 mb-2"
                      href={stripeLinkDelivery}
                    >
                      Acheter avec livraison
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}
