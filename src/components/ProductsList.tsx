import { PureBlocksRenderer } from "nebula-atoms";
import React, { useMemo } from "react";
import { PageAndBlocks } from "../types/PageAndBlocks";
import { parseProduct } from "./_helpers/parseProduct";

export default function ProductsList({
  products,
}: {
  products: PageAndBlocks[];
}) {
  const _products = useMemo(
    () => products.map((product) => parseProduct(product)),
    [products]
  );
  return (
    <div id="products-list">
      {_products.map(
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
            <div className="product my-5">
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
