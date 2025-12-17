import * as React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';
import { DocumentHeadTags, documentGetInitialProps } from '@mui/material-nextjs/v14-pagesRouter';
import theme from '@/styles/theme';
import Script from 'next/script';

export default function AdaptiveDocument(props) {
  return (
    <Html lang="en">
      <Head>
        {/* PWA primary color */}
        <meta name="theme-color" content={theme.palette.primary.main} />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="emotion-insertion-point" content="" />
        <DocumentHeadTags {...props} />



        <script
          type="text/javascript"
          src="https://assets.apollo.io/js/meetings/meetings-widget.js"
          defer
          data-appid="671a95320431f502ce274b0d"
          data-scheduling-link="mkq-h23-4je"
          strategy="afterInteractive"
          onLoad={() => {
            window.ApolloMeetings.initWidget({
              appId: "671a95320431f502ce274b0d",
              schedulingLink: "mkq-h23-4je",
              domElement: document.getElementById("apollo-meetings-widget"),
            });
          }}
        />
      </Head>
      <body>

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

AdaptiveDocument.getInitialProps = async (ctx) => {
  const finalProps = await documentGetInitialProps(ctx);
  return finalProps;
};
