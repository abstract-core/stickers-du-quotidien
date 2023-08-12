import { TextRichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import richTextToString from "../../helpers/richTextToString";
import { PageAndBlocks } from "../../types/PageAndBlocks";
import { Product } from "../../types/Product";

export function parseProduct({
  page,
  blocks,
}: PageAndBlocks): Partial<Product> & Pick<PageAndBlocks, "blocks"> {
  const title =
    (page.properties["Name"].type === "title" &&
      page.properties["Name"].title[0].plain_text) ||
    undefined;
  const imageUrl =
    page.properties["Image"].type === "files" &&
    page.properties["Image"].files[0]?.type === "file" &&
    page.properties["Image"].files[0]?.file.url;
  const imagePath =
    (imageUrl && `/${imageUrl.split("?")[0].split("/").pop()}`) || undefined;
  const category =
    (page.properties["Catégorie"]?.type === "select" &&
      page.properties["Catégorie"].select?.name) ||
    undefined;
  const description =
    (page.properties["Description"]?.type === "rich_text" &&
      richTextToString(
        page.properties["Description"].rich_text as TextRichTextItemResponse[]
      )) ||
    undefined;
  const height =
    (page.properties["Hauteur"]?.type === "number" &&
      page.properties["Hauteur"].number) ||
    undefined;
  const width =
    (page.properties["Largeur"]?.type === "number" &&
      page.properties["Largeur"].number) ||
    undefined;
  const price =
    (page.properties["Prix"]?.type === "number" &&
      page.properties["Prix"].number) ||
    undefined;
  const stripeLink =
    (page.properties["Lien Stripe"]?.type === "url" &&
      page.properties["Lien Stripe"].url) ||
    undefined;
  const stripeLinkDelivery =
    (page.properties["Lien Stripe (livraison)"]?.type === "url" &&
      page.properties["Lien Stripe (livraison)"].url) ||
    undefined;

  return {
    title,
    imagePath,
    category,
    description,
    height,
    width,
    price,
    stripeLink,
    stripeLinkDelivery,
    blocks,
  };
}
