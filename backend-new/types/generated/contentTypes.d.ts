import type { Schema, Struct } from '@strapi/strapi';

export interface AdminApiToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    encryptedKey: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'read-only'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminPermission extends Struct.CollectionTypeSchema {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    conditions: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<[]>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::permission'> &
      Schema.Attribute.Private;
    properties: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<'manyToOne', 'admin::role'>;
    subject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminRole extends Struct.CollectionTypeSchema {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::role'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<'manyToMany', 'admin::user'>;
  };
}

export interface AdminSession extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_sessions';
  info: {
    description: 'Session Manager storage';
    displayName: 'Session';
    name: 'Session';
    pluralName: 'sessions';
    singularName: 'session';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
    i18n: {
      localized: false;
    };
  };
  attributes: {
    absoluteExpiresAt: Schema.Attribute.DateTime & Schema.Attribute.Private;
    childId: Schema.Attribute.String & Schema.Attribute.Private;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deviceId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    expiresAt: Schema.Attribute.DateTime &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::session'> &
      Schema.Attribute.Private;
    origin: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sessionId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique;
    status: Schema.Attribute.String & Schema.Attribute.Private;
    type: Schema.Attribute.String & Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    userId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferTokenPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::transfer-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminUser extends Struct.CollectionTypeSchema {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    blocked: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    lastname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::user'> &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registrationToken: Schema.Attribute.String & Schema.Attribute.Private;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    roles: Schema.Attribute.Relation<'manyToMany', 'admin::role'> &
      Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String;
  };
}

export interface ApiAboutPageAboutPage extends Struct.SingleTypeSchema {
  collectionName: 'about_pages';
  info: {
    displayName: 'About Page';
    pluralName: 'about-pages';
    singularName: 'about-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    adaptiveIntelligenceBgImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    adaptiveIntelligenceBgVideo: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    adaptiveIntelligenceFeatures: Schema.Attribute.Component<
      'shared.adaptive-intelligence-features',
      true
    >;
    adaptiveIntelligenceTitle: Schema.Attribute.String;
    counterItems: Schema.Attribute.Component<'homepage.counter-item', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ctaBgBtnText: Schema.Attribute.String;
    ctaBgBtnUrl: Schema.Attribute.String;
    ctaBgImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    ctaBgSubtitle: Schema.Attribute.String;
    ctaBgTitle: Schema.Attribute.String;
    heroBackgroundImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    heroBackgroundType: Schema.Attribute.Enumeration<
      ['Shapes', 'Image', 'Video']
    >;
    heroBackgroundVideo: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    heroDescription: Schema.Attribute.Text;
    heroTitle: Schema.Attribute.String;
    letsTalkButtonText: Schema.Attribute.String;
    letsTalkButtonText2: Schema.Attribute.String;
    letsTalkButtonUrl2: Schema.Attribute.String;
    letsTalkParagraph1: Schema.Attribute.Text;
    letsTalkParagraph2: Schema.Attribute.Text;
    letsTalkTitle: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::about-page.about-page'
    > &
      Schema.Attribute.Private;
    metaDescription: Schema.Attribute.String;
    missionAuthorName: Schema.Attribute.String;
    missionAuthorTitle: Schema.Attribute.String;
    missionCustomerCount: Schema.Attribute.String;
    missionCustomerLabel: Schema.Attribute.String;
    missionImage1: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    missionImage2: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    missionImage3: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    missionImage4: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    missionQuote: Schema.Attribute.Text;
    missionQuoteHighlight: Schema.Attribute.String;
    missionRating: Schema.Attribute.Decimal;
    pagePreviewImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    pageTitle: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    statsSubtitle: Schema.Attribute.String;
    sustainabilityButtonText: Schema.Attribute.String;
    sustainabilityButtonUrl: Schema.Attribute.String;
    sustainabilityDescription: Schema.Attribute.Text;
    sustainabilityTagline: Schema.Attribute.String;
    sustainabilityTitle: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    value1_Description: Schema.Attribute.Text;
    value1_Image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    value1_Title: Schema.Attribute.String;
    value2_Description: Schema.Attribute.Text;
    value2_Image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    value2_Title: Schema.Attribute.String;
    value3_Description: Schema.Attribute.Text;
    value3_Image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    value3_Title: Schema.Attribute.String;
    value4_Description: Schema.Attribute.Text;
    value4_Image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    value4_Title: Schema.Attribute.String;
    valuesDescription: Schema.Attribute.Text;
    valuesSectionDescription: Schema.Attribute.Text;
    valuesSectionMainDescription: Schema.Attribute.Text;
    valuesSectionMainHeading: Schema.Attribute.Text;
    valuesSectionMissionHeading: Schema.Attribute.String;
    valuesSectionTitle: Schema.Attribute.String;
    valuesTagline: Schema.Attribute.String;
    valuesTitle: Schema.Attribute.String;
    whatWeDoCard1_Description: Schema.Attribute.Text;
    whatWeDoCard1_Icon: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    whatWeDoCard1_Title: Schema.Attribute.String;
    whatWeDoCard2_Description: Schema.Attribute.Text;
    whatWeDoCard2_Icon: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    whatWeDoCard2_Title: Schema.Attribute.String;
    whatWeDoCard3_Description: Schema.Attribute.Text;
    whatWeDoCard3_Icon: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    whatWeDoCard3_Title: Schema.Attribute.String;
    whatWeDoCard4_Description: Schema.Attribute.Text;
    whatWeDoCard4_Icon: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    whatWeDoCard4_Title: Schema.Attribute.String;
    whatWeDoCard5_Description: Schema.Attribute.Text;
    whatWeDoCard5_Icon: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    whatWeDoCard5_Title: Schema.Attribute.String;
    whatWeDoCard6_Description: Schema.Attribute.Text;
    whatWeDoCard6_Icon: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    whatWeDoCard6_Title: Schema.Attribute.String;
    whatWeDoDescription: Schema.Attribute.Text;
    whatWeDoTitle: Schema.Attribute.String;
    whoWeAreBadgeNumber: Schema.Attribute.String;
    whoWeAreBadgeText: Schema.Attribute.String;
    whoWeAreImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    whoWeAreParagraph1: Schema.Attribute.Text;
    whoWeAreParagraph2: Schema.Attribute.Text;
    whoWeAreParagraph3: Schema.Attribute.Text;
    whoWeAreTagline: Schema.Attribute.String;
    whoWeAreTitle: Schema.Attribute.String;
    whyChooseUsDescription: Schema.Attribute.String;
    whyChooseUsPoints: Schema.Attribute.Component<'about.bullet-point', true>;
    whyChooseUsTagline: Schema.Attribute.String;
    whyChooseUsTitle: Schema.Attribute.String;
  };
}

export interface ApiCaseStudiesPageCaseStudiesPage
  extends Struct.SingleTypeSchema {
  collectionName: 'case_studies_pages';
  info: {
    displayName: 'Case Studies Page';
    pluralName: 'case-studies-pages';
    singularName: 'case-studies-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ctaButtonText: Schema.Attribute.String;
    ctaButtonUrl: Schema.Attribute.String;
    ctaDescription: Schema.Attribute.Text;
    ctaLeftButtonText: Schema.Attribute.String;
    ctaLeftButtonUrl: Schema.Attribute.String;
    ctaLeftDescription: Schema.Attribute.String;
    ctaLeftTitle: Schema.Attribute.String;
    ctaRightButtonText: Schema.Attribute.String;
    ctaRightButtonUrl: Schema.Attribute.String;
    ctaRightDescription: Schema.Attribute.String;
    ctaRightTitle: Schema.Attribute.String;
    ctaTitle: Schema.Attribute.String;
    faqs: Schema.Attribute.Component<'case-studies-page.faq-item', true>;
    featuredTagline: Schema.Attribute.String;
    featuredTitle: Schema.Attribute.String;
    heroBackgroundImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    heroBackgroundType: Schema.Attribute.Enumeration<
      ['heroBackgroundImage', 'heroBackgroundVideo']
    >;
    heroBackgroundVideo: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    heroDescription: Schema.Attribute.Text;
    heroTagline: Schema.Attribute.String;
    heroTitle: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::case-studies-page.case-studies-page'
    > &
      Schema.Attribute.Private;
    metaDescription: Schema.Attribute.Text;
    pagePreviewImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    pageTitle: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    strategyCta: Schema.Attribute.String;
    strategyParagraph1: Schema.Attribute.Text;
    strategyParagraph2: Schema.Attribute.Text;
    strategyTitle: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCaseStudyDownloadCaseStudyDownload
  extends Struct.CollectionTypeSchema {
  collectionName: 'case_study_downloads';
  info: {
    displayName: 'Case Study Download';
    pluralName: 'case-study-downloads';
    singularName: 'case-study-download';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    downloaded_at: Schema.Attribute.String;
    email: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::case-study-download.case-study-download'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    resource_slug: Schema.Attribute.String;
    resource_title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCaseStudyCaseStudy extends Struct.CollectionTypeSchema {
  collectionName: 'case_studies';
  info: {
    displayName: 'Case Study';
    pluralName: 'case-studies';
    singularName: 'case-study';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    badge: Schema.Attribute.String;
    category: Schema.Attribute.String;
    client: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    downloadFile: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    heroImage: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    industry: Schema.Attribute.String;
    insights: Schema.Attribute.Component<'shared.insight', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::case-study.case-study'
    > &
      Schema.Attribute.Private;
    metrics: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    results: Schema.Attribute.String;
    slug: Schema.Attribute.UID<'title'>;
    tags: Schema.Attribute.Component<'shared.tag', true>;
    testimonialAuthor: Schema.Attribute.String;
    testimonialPosition: Schema.Attribute.String;
    testimonialQuote: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiClientLogoClientLogo extends Struct.CollectionTypeSchema {
  collectionName: 'client_logos';
  info: {
    displayName: 'Client Logo';
    pluralName: 'client-logos';
    singularName: 'client-logo';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::client-logo.client-logo'
    > &
      Schema.Attribute.Private;
    logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiContactFormSubmissionContactFormSubmission
  extends Struct.CollectionTypeSchema {
  collectionName: 'contact_form_submissions';
  info: {
    displayName: 'Contact Form Submission';
    pluralName: 'contact-form-submissions';
    singularName: 'contact-form-submission';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    companyName: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email;
    emailOptin: Schema.Attribute.Enumeration<['yes', 'no']>;
    firstName: Schema.Attribute.String;
    lastName: Schema.Attribute.String;
    leadSource: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::contact-form-submission.contact-form-submission'
    > &
      Schema.Attribute.Private;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    servicesNeeded: Schema.Attribute.JSON;
    submittedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiContactPageContactPage extends Struct.SingleTypeSchema {
  collectionName: 'contact_pages';
  info: {
    displayName: 'Contact Page';
    pluralName: 'contact-pages';
    singularName: 'contact-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    heroBackgroundImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    heroBackgroundType: Schema.Attribute.Enumeration<
      ['Video', 'Image', 'Shapes']
    >;
    heroBackgroundVideo: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::contact-page.contact-page'
    > &
      Schema.Attribute.Private;
    metaDescription: Schema.Attribute.Text;
    pagePreviewImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    pageTitle: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCreativesPageCreativesPage extends Struct.SingleTypeSchema {
  collectionName: 'creatives_pages';
  info: {
    displayName: 'Creatives Page';
    pluralName: 'creatives-pages';
    singularName: 'creatives-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    applyButtonText: Schema.Attribute.String;
    applyButtonUrl: Schema.Attribute.String;
    benefitsDescription: Schema.Attribute.Text;
    benefitsImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    benefitsTagline: Schema.Attribute.String;
    benefitsTitle: Schema.Attribute.String;
    contactButtonText: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ctaDescription: Schema.Attribute.Text;
    ctaTitle: Schema.Attribute.String;
    heroBackgroundImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    heroBackgroundType: Schema.Attribute.Enumeration<['Image', 'Video']>;
    heroBackgroundVideo: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    heroDescription: Schema.Attribute.Text;
    heroTagline: Schema.Attribute.String;
    heroTitle: Schema.Attribute.String;
    hrEmail: Schema.Attribute.Email;
    joinUsButtonText: Schema.Attribute.String;
    joinUsButtonUrl: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::creatives-page.creatives-page'
    > &
      Schema.Attribute.Private;
    metaDescription: Schema.Attribute.Text;
    missionImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    missionParagraph1: Schema.Attribute.Text;
    missionParagraph2: Schema.Attribute.Text;
    missionTitle: Schema.Attribute.String;
    pagePreviewImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    pageTitle: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    valuesDescription: Schema.Attribute.Text;
    valuesImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    valuesTagline: Schema.Attribute.String;
    valuesTitle: Schema.Attribute.String;
  };
}

export interface ApiEcoPageEcoPage extends Struct.SingleTypeSchema {
  collectionName: 'eco_pages';
  info: {
    displayName: 'Eco Page';
    pluralName: 'eco-pages';
    singularName: 'eco-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    commitmentDescription: Schema.Attribute.Text;
    commitmentTagline: Schema.Attribute.String;
    commitmentTitle: Schema.Attribute.String;
    communityCtaText: Schema.Attribute.String;
    communityDescription: Schema.Attribute.Text;
    communityEmail: Schema.Attribute.Email;
    communityTitle: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    heroBackgroundType: Schema.Attribute.Enumeration<['Image', 'Video']> &
      Schema.Attribute.DefaultTo<'Image'>;
    heroBackgroundVideo: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    heroDescription: Schema.Attribute.Text;
    heroTitle: Schema.Attribute.String;
    hubCards: Schema.Attribute.Component<'eco.hub-card', true>;
    impactBackgroundImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    impactDescription: Schema.Attribute.Text;
    impactTitle: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::eco-page.eco-page'
    > &
      Schema.Attribute.Private;
    metaDescription: Schema.Attribute.Text;
    noaaDownloadButtonText: Schema.Attribute.String;
    noaaDownloadUrl: Schema.Attribute.String;
    noaaImage: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    noaaParagraph1: Schema.Attribute.Text;
    noaaParagraph2: Schema.Attribute.Text;
    noaaTitle: Schema.Attribute.String;
    pagePreviewImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    pageTitle: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    treeCardButtonText: Schema.Attribute.String;
    treeCardButtonUrl: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiFaqFaq extends Struct.CollectionTypeSchema {
  collectionName: 'faqs';
  info: {
    displayName: 'FAQ';
    pluralName: 'faqs';
    singularName: 'faq';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    answer: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::faq.faq'> &
      Schema.Attribute.Private;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    publishedAt: Schema.Attribute.DateTime;
    question: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiHomepageHomepage extends Struct.SingleTypeSchema {
  collectionName: 'homepages';
  info: {
    displayName: 'Homepage';
    pluralName: 'homepages';
    singularName: 'homepage';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ctaButtonText: Schema.Attribute.String;
    ctaButtonText2: Schema.Attribute.String;
    ctaButtonUrl: Schema.Attribute.String;
    ctaButtonUrl2: Schema.Attribute.String;
    ctaDescription: Schema.Attribute.Text;
    ctaTitle: Schema.Attribute.Text;
    ctaTitleEnd: Schema.Attribute.String;
    ctaTitleHighlight: Schema.Attribute.String;
    faqTagline: Schema.Attribute.String;
    faqTitle: Schema.Attribute.String;
    faqTitleEnd: Schema.Attribute.String;
    faqTitleHighlight: Schema.Attribute.String;
    featureButtonText: Schema.Attribute.String;
    featureButtonUrl: Schema.Attribute.String;
    featureContent: Schema.Attribute.Component<'homepage.text-chunk', true>;
    featureImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    featureLinkText: Schema.Attribute.String;
    featureTagline: Schema.Attribute.String;
    featureTitle: Schema.Attribute.String;
    featureTitleHighlight: Schema.Attribute.String;
    feedbackAuthorName: Schema.Attribute.String;
    feedbackAuthorTitle: Schema.Attribute.String;
    feedbackAvatar: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    feedbackQuoteEnd: Schema.Attribute.String;
    feedbackQuoteHighlight: Schema.Attribute.String;
    feedbackQuoteStart: Schema.Attribute.String;
    heroBackgroundImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    heroBackgroundType: Schema.Attribute.Enumeration<
      ['Shapes', 'Image', 'Video']
    >;
    heroBackgroundVideo: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    heroButtonText: Schema.Attribute.String;
    heroButtonText2: Schema.Attribute.String;
    heroButtonUrl2: Schema.Attribute.String;
    heroHighlightedText: Schema.Attribute.String;
    heroSubtitleBold: Schema.Attribute.String;
    heroSubtitleEnd: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 10000;
      }>;
    heroSubtitleStart: Schema.Attribute.Text;
    heroTitle: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::homepage.homepage'
    > &
      Schema.Attribute.Private;
    metaDescription: Schema.Attribute.Text;
    pagePreviewImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    pageTitle: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    services: Schema.Attribute.Relation<'oneToMany', 'api::service.service'>;
    servicesSubtitle: Schema.Attribute.String;
    servicesTitle: Schema.Attribute.String;
    servicesTitleHighlight: Schema.Attribute.String;
    successStoriesCustomerCount: Schema.Attribute.String;
    successStoriesCustomerLabel: Schema.Attribute.String;
    successStoriesTagline: Schema.Attribute.String;
    successStoriesTitle: Schema.Attribute.String;
    successStoriesTitleEnd: Schema.Attribute.String;
    successStoriesTitleHighlight: Schema.Attribute.String;
    successStory1AuthorCompany: Schema.Attribute.String;
    successStory1AuthorName: Schema.Attribute.String;
    successStory1Image: Schema.Attribute.Media<'images'>;
    successStory1QuoteEnd: Schema.Attribute.Text;
    successStory1QuoteHighlight: Schema.Attribute.String;
    successStory1QuoteStart: Schema.Attribute.Text;
    testimonialsBackgroundImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    testimonialsTagline: Schema.Attribute.String;
    testimonialsTitle: Schema.Attribute.String;
    testimonialsTitleEnd: Schema.Attribute.String;
    testimonialsTitleHighlight: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    whyUsButtonText: Schema.Attribute.String;
    whyUsButtonUrl: Schema.Attribute.String;
    whyUsCounterItems: Schema.Attribute.Component<
      'homepage.counter-item',
      true
    >;
    whyUsDescription: Schema.Attribute.Text;
    whyUsDescription2: Schema.Attribute.Text;
    whyUsImageCardLabel: Schema.Attribute.String;
    whyUsImageCardStat: Schema.Attribute.String;
    whyUsInfoBox1Icon: Schema.Attribute.Media<'images'>;
    whyUsInfoBox1Title: Schema.Attribute.String;
    whyUsInfoBox2Icon1: Schema.Attribute.Media<'images'>;
    whyUsInfoBox2Title: Schema.Attribute.String;
    whyUsMainImage: Schema.Attribute.Media<'images'>;
    whyUsTagline: Schema.Attribute.String;
    whyUsTitle: Schema.Attribute.String;
    whyUsTitleEnd: Schema.Attribute.String;
    whyUsTitleHighlight: Schema.Attribute.String;
  };
}

export interface ApiIndustryIndustry extends Struct.CollectionTypeSchema {
  collectionName: 'industries';
  info: {
    displayName: 'Industry';
    pluralName: 'industries';
    singularName: 'industry';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::industry.industry'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    order: Schema.Attribute.Integer;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiLetsTalkSubmissionLetsTalkSubmission
  extends Struct.CollectionTypeSchema {
  collectionName: 'lets_talk_submissions';
  info: {
    displayName: 'Lets Talk Submission';
    pluralName: 'lets-talk-submissions';
    singularName: 'lets-talk-submission';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    company: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email;
    firstName: Schema.Attribute.String;
    lastName: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::lets-talk-submission.lets-talk-submission'
    > &
      Schema.Attribute.Private;
    message: Schema.Attribute.Text;
    publishedAt: Schema.Attribute.DateTime;
    submittedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNewsletterNewsletter extends Struct.CollectionTypeSchema {
  collectionName: 'newsletters';
  info: {
    displayName: 'Newsletter';
    pluralName: 'newsletters';
    singularName: 'newsletter';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.String & Schema.Attribute.Unique;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::newsletter.newsletter'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiServiceListServiceList extends Struct.CollectionTypeSchema {
  collectionName: 'service_lists';
  info: {
    displayName: 'Service List';
    pluralName: 'service-lists';
    singularName: 'service-list';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    buttonText: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    color: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    features: Schema.Attribute.Component<'shared.bullet-point', true>;
    footer_text: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::service-list.service-list'
    > &
      Schema.Attribute.Private;
    order: Schema.Attribute.Integer;
    publishedAt: Schema.Attribute.DateTime;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiServiceService extends Struct.CollectionTypeSchema {
  collectionName: 'services';
  info: {
    displayName: 'Service';
    pluralName: 'services';
    singularName: 'service';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    buttonText: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    color: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description_bold: Schema.Attribute.String;
    description_end: Schema.Attribute.Text;
    description_intro: Schema.Attribute.Text;
    footer_text: Schema.Attribute.String;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::service.service'
    > &
      Schema.Attribute.Private;
    order: Schema.Attribute.Integer;
    publishedAt: Schema.Attribute.DateTime;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiServicesPageServicesPage extends Struct.SingleTypeSchema {
  collectionName: 'services_pages';
  info: {
    displayName: 'Services Page';
    pluralName: 'services-pages';
    singularName: 'services-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    approachButtonText: Schema.Attribute.String;
    approachButtonUrl: Schema.Attribute.String;
    approachDescription: Schema.Attribute.Text;
    approachImage: Schema.Attribute.Media<'images'>;
    approachPhases: Schema.Attribute.Component<'shared.key-phase', true>;
    approachTagline: Schema.Attribute.String;
    approachTitle: Schema.Attribute.String;
    approachTitleHighlight: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ctaBgBtnText: Schema.Attribute.String;
    ctaBgBtnUrl: Schema.Attribute.String;
    ctaBgImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    ctaBgSubtitle: Schema.Attribute.String;
    ctaBgTitle: Schema.Attribute.String;
    ctaButtonText: Schema.Attribute.String;
    ctaButtonText2: Schema.Attribute.String;
    ctaButtonUrl: Schema.Attribute.String;
    ctaButtonUrl2: Schema.Attribute.String;
    ctaDescription: Schema.Attribute.Text;
    ctaTitle1: Schema.Attribute.String;
    ctaTitleEnd: Schema.Attribute.String;
    ctaTitleHighlight: Schema.Attribute.String;
    faqTagline: Schema.Attribute.String;
    faqTitle: Schema.Attribute.String;
    faqTitleEnd: Schema.Attribute.String;
    faqTitleHighlight: Schema.Attribute.String;
    heroBackgroundImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    heroBackgroundType: Schema.Attribute.Enumeration<
      ['Shapes', 'Image', 'Video']
    >;
    heroBackgroundVideo: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    industries: Schema.Attribute.Relation<
      'oneToMany',
      'api::industry.industry'
    >;
    industriesButtonText: Schema.Attribute.String;
    industriesButtonUrl: Schema.Attribute.String;
    industriesHeading: Schema.Attribute.String;
    industriesHeadingHighlight: Schema.Attribute.String;
    industriesImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    industriesSubtext: Schema.Attribute.Text;
    industriesSubtext2: Schema.Attribute.Text;
    insightsBodyText: Schema.Attribute.Text;
    insightsButtonText: Schema.Attribute.String;
    insightsButtonUrl: Schema.Attribute.String;
    insightsHeading: Schema.Attribute.String;
    insightsImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::services-page.services-page'
    > &
      Schema.Attribute.Private;
    metaDescription: Schema.Attribute.Text;
    pagePreviewImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    pageTitle: Schema.Attribute.String;
    processImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    publishedAt: Schema.Attribute.DateTime;
    services: Schema.Attribute.Relation<'oneToMany', 'api::service.service'>;
    servicesHeroDescription: Schema.Attribute.Text;
    servicesHeroTitle: Schema.Attribute.String;
    servicesHeroTitleHighlight: Schema.Attribute.String;
    servicesSectionDescription: Schema.Attribute.Text;
    servicesSectionTagline: Schema.Attribute.String;
    servicesSectionTitle: Schema.Attribute.String;
    servicesSectionTitleHighlight: Schema.Attribute.String;
    testimonialsBackgroundImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    testimonialsDescription: Schema.Attribute.Text;
    testimonialsTagline: Schema.Attribute.String;
    testimonialsTitle: Schema.Attribute.String;
    testimonialsTitleEnd: Schema.Attribute.String;
    testimonialsTitleHighlight: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSettingSetting extends Struct.SingleTypeSchema {
  collectionName: 'settings';
  info: {
    displayName: 'Settings';
    pluralName: 'settings';
    singularName: 'setting';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    address: Schema.Attribute.Text;
    addressTitle: Schema.Attribute.String;
    clientEmail: Schema.Attribute.Email;
    clientEmailLabel: Schema.Attribute.String;
    contactInfoText: Schema.Attribute.String;
    contactInfoTitle: Schema.Attribute.String;
    copyrightText: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    emailSupportText: Schema.Attribute.String;
    emailSupportTitle: Schema.Attribute.String;
    facebookPixelCode: Schema.Attribute.Text;
    facebookUrl: Schema.Attribute.String;
    favicon: Schema.Attribute.Media<'images'>;
    googleAnalyticsCode: Schema.Attribute.Text;
    googleTagManagerCode: Schema.Attribute.Text;
    googleUrl: Schema.Attribute.String;
    instagramUrl: Schema.Attribute.String;
    linkedInInsightTagCode: Schema.Attribute.Text;
    linkedinUrl: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::setting.setting'
    > &
      Schema.Attribute.Private;
    logo: Schema.Attribute.Media<'images'>;
    logoFooter: Schema.Attribute.Media<'images'>;
    mediaEmail: Schema.Attribute.Email;
    mediaEmailLabel: Schema.Attribute.String;
    phoneNumber: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    siteDescription: Schema.Attribute.Text;
    sitePreviewImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    siteTagline: Schema.Attribute.String;
    siteTitle: Schema.Attribute.String;
    spotifyUrl: Schema.Attribute.String;
    supportEmail: Schema.Attribute.Email;
    twitterUrl: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    upworkUrl: Schema.Attribute.String;
    youtubeUrl: Schema.Attribute.String;
  };
}

export interface ApiTeamMemberTeamMember extends Struct.CollectionTypeSchema {
  collectionName: 'team_members';
  info: {
    displayName: 'Team Member';
    pluralName: 'team-members';
    singularName: 'team-member';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    bio_long: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    group: Schema.Attribute.Enumeration<['Executive', 'Creative']>;
    headshot: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    linkedin_url: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::team-member.team-member'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTeamPageTeamPage extends Struct.SingleTypeSchema {
  collectionName: 'team_pages';
  info: {
    displayName: 'Team Page';
    pluralName: 'team-pages';
    singularName: 'team-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    heroBackgroundImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    heroBackgroundType: Schema.Attribute.Enumeration<
      ['Image', 'Video', 'Shapes']
    >;
    heroBackgroundVideo: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    heroDescription: Schema.Attribute.Text;
    heroTitle: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::team-page.team-page'
    > &
      Schema.Attribute.Private;
    metaDescription: Schema.Attribute.Text;
    pagePreviewImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    pageTitle: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTestimonialTestimonial extends Struct.CollectionTypeSchema {
  collectionName: 'testimonials';
  info: {
    displayName: 'Testimonial';
    pluralName: 'testimonials';
    singularName: 'testimonial';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    background: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#FA0B5F'>;
    company: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::testimonial.testimonial'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.Text;
    order: Schema.Attribute.Integer;
    position: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    text: Schema.Attribute.Text;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiValueValue extends Struct.CollectionTypeSchema {
  collectionName: 'values';
  info: {
    displayName: 'Value';
    pluralName: 'values';
    singularName: 'value';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::value.value'> &
      Schema.Attribute.Private;
    order: Schema.Attribute.Integer;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesRelease
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    releasedAt: Schema.Attribute.DateTime;
    scheduledAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Schema.Attribute.Required;
    timezone: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    entryDocumentId: Schema.Attribute.String;
    isEntryValid: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    release: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Schema.Attribute.Enumeration<['publish', 'unpublish']> &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginI18NLocale extends Struct.CollectionTypeSchema {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String & Schema.Attribute.Unique;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::i18n.locale'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflow
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows';
  info: {
    description: '';
    displayName: 'Workflow';
    name: 'Workflow';
    pluralName: 'workflows';
    singularName: 'workflow';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentTypes: Schema.Attribute.JSON &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'[]'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    stageRequiredToPublish: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::review-workflows.workflow-stage'
    >;
    stages: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflowStage
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows_stages';
  info: {
    description: '';
    displayName: 'Stages';
    name: 'Workflow Stage';
    pluralName: 'workflow-stages';
    singularName: 'workflow-stage';
  };
  options: {
    draftAndPublish: false;
    version: '1.1.0';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#4945FF'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    permissions: Schema.Attribute.Relation<'manyToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    workflow: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::review-workflows.workflow'
    >;
  };
}

export interface PluginUploadFile extends Struct.CollectionTypeSchema {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Schema.Attribute.String;
    caption: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ext: Schema.Attribute.String;
    folder: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'> &
      Schema.Attribute.Private;
    folderPath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    formats: Schema.Attribute.JSON;
    hash: Schema.Attribute.String & Schema.Attribute.Required;
    height: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.file'
    > &
      Schema.Attribute.Private;
    mime: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    previewUrl: Schema.Attribute.String;
    provider: Schema.Attribute.String & Schema.Attribute.Required;
    provider_metadata: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    related: Schema.Attribute.Relation<'morphToMany'>;
    size: Schema.Attribute.Decimal & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    width: Schema.Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Struct.CollectionTypeSchema {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.folder'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    files: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.file'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.folder'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    parent: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'>;
    path: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    pathId: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.role'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.String & Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    blocked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    confirmationToken: Schema.Attribute.String & Schema.Attribute.Private;
    confirmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    > &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ContentTypeSchemas {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::session': AdminSession;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::about-page.about-page': ApiAboutPageAboutPage;
      'api::case-studies-page.case-studies-page': ApiCaseStudiesPageCaseStudiesPage;
      'api::case-study-download.case-study-download': ApiCaseStudyDownloadCaseStudyDownload;
      'api::case-study.case-study': ApiCaseStudyCaseStudy;
      'api::client-logo.client-logo': ApiClientLogoClientLogo;
      'api::contact-form-submission.contact-form-submission': ApiContactFormSubmissionContactFormSubmission;
      'api::contact-page.contact-page': ApiContactPageContactPage;
      'api::creatives-page.creatives-page': ApiCreativesPageCreativesPage;
      'api::eco-page.eco-page': ApiEcoPageEcoPage;
      'api::faq.faq': ApiFaqFaq;
      'api::homepage.homepage': ApiHomepageHomepage;
      'api::industry.industry': ApiIndustryIndustry;
      'api::lets-talk-submission.lets-talk-submission': ApiLetsTalkSubmissionLetsTalkSubmission;
      'api::newsletter.newsletter': ApiNewsletterNewsletter;
      'api::service-list.service-list': ApiServiceListServiceList;
      'api::service.service': ApiServiceService;
      'api::services-page.services-page': ApiServicesPageServicesPage;
      'api::setting.setting': ApiSettingSetting;
      'api::team-member.team-member': ApiTeamMemberTeamMember;
      'api::team-page.team-page': ApiTeamPageTeamPage;
      'api::testimonial.testimonial': ApiTestimonialTestimonial;
      'api::value.value': ApiValueValue;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::review-workflows.workflow': PluginReviewWorkflowsWorkflow;
      'plugin::review-workflows.workflow-stage': PluginReviewWorkflowsWorkflowStage;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
