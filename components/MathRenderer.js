import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors } from '../theme/colors';

export function MathRenderer({ latex, displayMode = false, fontSize = 14 }) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
      <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
      <style>
        * { margin: 0; padding: 0; }
        body {
          background: transparent;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: ${displayMode ? '40px' : '24px'};
        }
        .katex {
          font-size: ${fontSize}px !important;
          color: #f0f0f5 !important;
        }
        .katex .accent { color: #00ffcc !important; }
        .katex .purple { color: #a78bfa !important; }
      </style>
    </head>
    <body>
      <div id="math"></div>
      <script>
        try {
          const formula = ${JSON.stringify(latex)};
          katex.render(formula, document.getElementById('math'), {
            displayMode: ${displayMode},
            throwOnError: false,
            trust: true,
          });
        } catch(e) {
          document.getElementById('math').textContent = ${JSON.stringify(latex)};
        }
      </script>
    </body>
    </html>
  `;

  const height = displayMode ? 60 : 30;

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        javaScriptEnabled={true}
        originWhitelist={['*']}
        onShouldStartLoadWithRequest={() => true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    backgroundColor: 'transparent',
    width: '100%',
  },
});