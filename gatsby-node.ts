import {
  BlockObjectResponse,
  PageObjectResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { readFile } from "fs/promises";
import { GatsbyNode } from "gatsby";
import path from "path";
import { DefaultTemplateContext } from "statikon";
import richTextToString from "./src/helpers/richTextToString";
import titlePropToString from "./src/helpers/titlePropToString";
import React from "react";
import { ProductsTemplateContext } from "./src/templates/products.template";

export const createPages: GatsbyNode["createPages"] = async ({ actions }) => {
  const { createPage } = actions;

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
    "bg" | "text" | "navbar" | "contents" | "footer"
  > = {
    bg: "COLORS",
    text: "COLORS",
    navbar: {
      bg: "COLORS",
      text: "COLORS",
      links: [
        {
          title: "Produits",
          path: "/produits",
        },
      ],
    },
    contents: [],
    footer: {
      bg: "COLORS",
      text: "COLORS",
      a: "COLORS",
      links: [
        {
          title: "Accueil",
          path: "/",
        },
        {
          title: "Produits",
          path: "/produits",
        },
      ],
      mentions: true,
    },
  };

  /*
   * 3. PAGE [& CONTENTS] RENDERING
   */

  const TITLE = "Stickers du quotidien";

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
      title: name.type === "title" && titlePropToString(name),
      blocks,
      head: {
        title: `${name.type === "title" && titlePropToString(name)} | ${TITLE}`,
        description:
          description.type === "rich_text" &&
          richTextToString(description.rich_text as TextRichTextItemResponse[]),
        // noIndex: robots.type === "select" && robots.select?.name === "Masqué",
      },
      ...sharedProps,
    } as DefaultTemplateContext;

    createPage({
      component: path.resolve(
        `./src/templates/${
          stringUrl === "/produits" ? "products" : "default"
        }.template.tsx`
      ),
      path: stringUrl || page.id,
      context:
        stringUrl === "/produits"
          ? ({
              ...defaultContext,
              products,
            } as ProductsTemplateContext)
          : defaultContext,
    });
  });
};
