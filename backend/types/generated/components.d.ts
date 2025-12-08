import type { Schema, Struct } from '@strapi/strapi';

export interface ContentPageContent extends Struct.ComponentSchema {
  collectionName: 'components_content_page_contents';
  info: {
    displayName: 'page-content';
    icon: 'file';
  };
  attributes: {
    list_items: Schema.Attribute.Relation<
      'oneToMany',
      'api::list-item.list-item'
    >;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'content.page-content': ContentPageContent;
    }
  }
}
