import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: `**/*.mdx`,
  fields: { 
    title: { type: "string", required: true },
    description: { type: "string", required: false }
  },
  contentType: "mdx",
}));

export default makeSource({
  contentDirPath: "src/content",
  documentTypes: [Page],
});