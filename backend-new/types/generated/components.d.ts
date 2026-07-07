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

export interface HomepageTextChunk extends Struct.ComponentSchema {
  collectionName: 'components_homepage_text_chunks';
  info: {
    displayName: 'Text Chunk';
  };
  attributes: {
    isBold: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.Text;
  };
}

export interface SharedAdaptiveIntelligenceFeatures
  extends Struct.ComponentSchema {
  collectionName: 'components_shared_adaptive_intelligence_features';
  info: {
    displayName: 'adaptiveIntelligenceFeatures';
  };
  attributes: {
    text: Schema.Attribute.Text;
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

export interface SharedCtaBanner extends Struct.ComponentSchema {
  collectionName: 'components_shared_cta_banners';
  info: {
    displayName: 'cta-banner';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    buttonText: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
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

export interface NonCompliantCompanyCard extends Struct.ComponentSchema {
  collectionName: 'components_non_compliant_company_cards';
  info: {
    displayName: 'Company Card';
  };
  attributes: {
    adaptiveScore: Schema.Attribute.Integer;
    description: Schema.Attribute.Text;
    esgScoreUrl: Schema.Attribute.String;
    name: Schema.Attribute.String;
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
      'homepage.text-chunk': HomepageTextChunk;
      'non-compliant.company-card': NonCompliantCompanyCard;
      'shared.adaptive-intelligence-features': SharedAdaptiveIntelligenceFeatures;
      'shared.bullet-point': SharedBulletPoint;
      'shared.cta-banner': SharedCtaBanner;
      'shared.industry-item': SharedIndustryItem;
      'shared.insight': SharedInsight;
      'shared.key-phase': SharedKeyPhase;
      'shared.tag': SharedTag;
    }
  }
}
