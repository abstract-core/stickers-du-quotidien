import React from "react";
import {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import {
  CustomizableTemplate,
  CustomizableTemplateContext,
} from "nebula-atoms";
import { PageProps } from "gatsby";
import ProductsList from "../components/ProductsList";

export type ProductsTemplateContext = CustomizableTemplateContext & {
  products: {
    page: PageObjectResponse;
    blocks: BlockObjectResponse[];
  }[];
};

const ProductsTemplate = ({
  pageContext: { products, ...props },
}: PageProps<undefined, ProductsTemplateContext>) => (
  <CustomizableTemplate
    {...props}
    staticBlocks={{
      ["liste-produits"]: <ProductsList products={products} />,
    }}
  />
);

export default ProductsTemplate;
