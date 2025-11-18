import type { Schema, Struct } from '@strapi/strapi';

export interface AboutBulletPoint extends Struct.ComponentSchema {
  collectionName: 'components_about_bullet_points';
  info: {
    displayName: 'Bullet Point';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface AboutValueCard extends Struct.ComponentSchema {
  collectionName: 'components_about_value_cards';
  info: {
    displayName: 'Value Card';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface AboutWhatWeDoCard extends Struct.ComponentSchema {
  collectionName: 'components_about_what_we_do_cards';
  info: {
    displayName: 'What We Do Card';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface CaseStudiesPageFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_case_studies_page_faq_items';
  info: {
    displayName: 'FAQ Item';
  };
  attributes: {
    answer: Schema.Attribute.Text;
    question: Schema.Attribute.String;
  };
}

export interface EcoHubCard extends Struct.ComponentSchema {
  collectionName: 'components_eco_hub_cards';
  info: {
    displayName: 'Hub Card';
  };
  attributes: {
    description: Schema.Attribute.Text;
    iconType: Schema.Attribute.Enumeration<['tools', 'research', 'community']>;
    title: Schema.Attribute.String;
  };
}

export interface HomepageCounterItem extends Struct.ComponentSchema {
  collectionName: 'components_homepage_counter_items';
  info: {
    description: '';
    displayName: 'Counter Item';
    icon: 'chart-pie';
  };
  attributes: {
    color: Schema.Attribute.String;
    symbol: Schema.Attribute.String;
    title: Schema.Attribute.String;
    value: Schema.Attribute.Integer;
  };
}

export interface HomepageFeatureListItem extends Struct.ComponentSchema {
  collectionName: 'components_homepage_feature_list_items';
  info: {
    displayName: 'FeatureListItem';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface SharedBulletPoint extends Struct.ComponentSchema {
  collectionName: 'components_shared_bullet_points';
  info: {
    displayName: 'Bullet Point';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface SharedIndustryItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_industry_items';
  info: {
    displayName: 'Industry Item';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Schema.Attribute.String;
  };
}

export interface SharedInsight extends Struct.ComponentSchema {
  collectionName: 'components_shared_insights';
  info: {
    displayName: 'Insight';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface SharedKeyPhase extends Struct.ComponentSchema {
  collectionName: 'components_shared_key_phases';
  info: {
    displayName: 'Key Phase';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedTag extends Struct.ComponentSchema {
  collectionName: 'components_shared_tags';
  info: {
    displayName: 'Tag';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about.bullet-point': AboutBulletPoint;
      'about.value-card': AboutValueCard;
      'about.what-we-do-card': AboutWhatWeDoCard;
      'case-studies-page.faq-item': CaseStudiesPageFaqItem;
      'eco.hub-card': EcoHubCard;
      'homepage.counter-item': HomepageCounterItem;
      'homepage.feature-list-item': HomepageFeatureListItem;
      'shared.bullet-point': SharedBulletPoint;
      'shared.industry-item': SharedIndustryItem;
      'shared.insight': SharedInsight;
      'shared.key-phase': SharedKeyPhase;
      'shared.tag': SharedTag;
    }
  }
}
