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
            const imageUrl =
              p.page.properties["Image"].type === "files" &&
              p.page.properties["Image"].files[0]?.type === "file" &&
              p.page.properties["Image"].files[0]?.file.url;
            const imagePath =
              imageUrl && `/${imageUrl.split("?")[0].split("/").pop()}`;
            return (
              <div>
                {title}
                {imagePath && <img src={imagePath} />}
              </div>
            );
          })}
        </>
      ),
    }}
  />
);

export default ProductsTemplate;
