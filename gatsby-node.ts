import {
  BlockObjectResponse,
  PageObjectResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { readFile } from "fs/promises";
import { GatsbyNode } from "gatsby";
import path from "path";
import { DefaultTemplateContext } from "nebula-atoms";
import richTextToString from "./src/helpers/richTextToString";
import titlePropToString from "./src/helpers/titlePropToString";
import { ProductsTemplateContext } from "./src/templates/products.template";

export const createPages: GatsbyNode["createPages"] = async ({ actions }) => {
  const { createPage } = actions;

  const TITLE = "Stickers pour la maison";

  /*
   * 1. PAGE [& CONTENTS] RETRIEVING
   */

  const pagesCache = JSON.parse(
    await readFile("./cache/pages/pages.json", "utf-8")
  ) as PageObjectResponse[];

  const pages = await Promise.all(
    pagesCache.map(async (page) => ({
      page,
      blocks: JSON.parse(
        await readFile(`./cache/pages/pages/${page.id}/page.json`, "utf-8")
      ) as BlockObjectResponse[],
    }))
  );

  const productsCache = JSON.parse(
    await readFile("./cache/products/pages.json", "utf-8")
  ) as PageObjectResponse[];

  const products = await Promise.all(
    productsCache.map(async (page) => ({
      page,
      blocks: JSON.parse(
        await readFile(`./cache/products/pages/${page.id}/page.json`, "utf-8")
      ) as BlockObjectResponse[],
    }))
  );

  /*
   * 2. SHARED PROPS
   */

  const sharedProps: Pick<
    DefaultTemplateContext,
    "navbar" | "contents" | "footer"
  > = {
    navbar: {
      title: TITLE,
      links: [
        {
          title: "Nos stickers",
          path: "/stickers",
        },
      ],
    },
    contents: [],
    footer: {
      links: [
        {
          title: "Accueil",
          path: "/",
        },
        {
          title: "Nos stickers",
          path: "/stickers",
        },
      ],
      mentions: true,
    },
  };

  /*
   * 3. PAGE [& CONTENTS] RENDERING
   */

  pages.forEach(({ page, blocks }) => {
    const {
      Name: name,
      Url: url,
      ["Meta-description"]: description,
    } = page.properties;

    const stringUrl =
      url.type === "rich_text" &&
      richTextToString(url.rich_text as TextRichTextItemResponse[]);

    const defaultContext = {
      ...sharedProps,
      pageTitle: name.type === "title" && titlePropToString(name),
      blocks,
      head: {
        title: `${name.type === "title" && titlePropToString(name)} | ${TITLE}`,
        favicon: "astraliko.svg",
        description:
          description.type === "rich_text" &&
          richTextToString(description.rich_text as TextRichTextItemResponse[]),
        // noIndex: robots.type === "select" && robots.select?.name === "Masqué",
      },
    } as DefaultTemplateContext;

    createPage({
      component: path.resolve(
        `./src/templates/${
          stringUrl === "/stickers" ? "products" : "default"
        }.template.tsx`
      ),
      path: stringUrl || page.id,
      context:
        stringUrl === "/stickers"
          ? ({
              ...defaultContext,
              products,
            } as ProductsTemplateContext)
          : defaultContext,
    });
  });
};
