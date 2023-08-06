import React from "react";
import {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { CustomizableTemplate, CustomizableTemplateContext } from "statikon";
import { PageProps } from "gatsby";

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
      ["liste-produits"]: (
        <>
          {products.map((p) => {
            const title =
              p.page.properties["Name"].type === "title" &&
              p.page.properties["Name"].title[0].plain_text;
            return <div>{title}</div>;
          })}
        </>
      ),
    }}
  />
);

export default ProductsTemplate;
