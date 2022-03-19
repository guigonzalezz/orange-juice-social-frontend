import { Children } from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import { createEmotionCache } from '../utils/create-emotion-cache';

class CustomDocument extends Document {

  static async getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage;
    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    ctx.renderPage = () => originalRenderPage({
      enhanceApp: (App) => (props) => (
        <App
          emotionCache={cache}
          {...props}
        />
      )
    });

    const initialProps = await Document.getInitialProps(ctx);
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    return {
      ...initialProps,
      styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags]
    };
  };

  render() {
    return (
      <Html lang="en">
        <Head>
          <link href="https://fonts.googleapis.com" rel="preconnect" />
          <link href="https://fonts.gstatic.com" rel="preconnect" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css?family=Roboto+Mono|Roboto+Slab|Roboto:300,400,500,700&display=optional" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Anton&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css2?family=Anton&family=Poppins:wght@100;300;500;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet"/>
          <meta name="theme-color" content="#111827"/>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
