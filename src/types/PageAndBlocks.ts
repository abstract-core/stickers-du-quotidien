import {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type PageAndBlocks = {
  page: PageObjectResponse;
  blocks: BlockObjectResponse[];
};
