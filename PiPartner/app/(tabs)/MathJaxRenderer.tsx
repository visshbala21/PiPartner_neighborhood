import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { THEME } from '../../constants/Colors';

interface MathJaxRendererProps {
  content: string;
  style?: any;
}

const MathJaxRenderer: React.FC<MathJaxRendererProps> = ({ content, style }) => {
  const [isLoading, setIsLoading] = React.useState(true);

  // Format the content as HTML with MathJax support
  const formatContent = (text: string) => {
    if (!text) return '';
    
    // Process the text to properly handle LaTeX
    let formattedContent = text;
    
    // Clean up escaped backslashes from JSON strings that cause issues with LaTeX
    formattedContent = formattedContent
      .replace(/\\\\/g, '\\')
      // Fix any instances of additional dollar signs that shouldn't be there
      .replace(/\$([^$]*)\$/g, '$1')
      // Make sure display math delimiters work properly
      .replace(/\\\[/g, '$$')
      .replace(/\\\]/g, '$$')
      // Fix inline math delimiters
      .replace(/\\\(/g, '$')
      .replace(/\\\)/g, '$');
      
    // Handle markdown formatting
    formattedContent = formattedContent
      // Handle bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Handle emphasis
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Handle headers
      .replace(/^###\s+(.*?)$/gm, '<h3>$1</h3>')
      .replace(/^##\s+(.*?)$/gm, '<h2>$1</h2>')
      .replace(/^#\s+(.*?)$/gm, '<h1>$1</h1>')
      // Handle horizontal rules
      .replace(/^---$/gm, '<hr/>');
      
    // Preserve newlines and structure
    formattedContent = formattedContent
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');

    return formattedContent;
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
        <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
        <script>
          window.MathJax = {
            tex: {
              inlineMath: [['$', '$']],
              displayMath: [['$$', '$$']],
              processEscapes: true,
              processEnvironments: true
            },
            svg: {
              fontCache: 'global'
            },
            options: {
              enableMenu: false
            },
            startup: {
              ready: function() {
                MathJax.startup.defaultReady();
                setTimeout(function() {
                  window.ReactNativeWebView.postMessage('rendered');
                }, 1000);
              }
            }
          };
        </script>
        <style>
          body {
            font-size: 16px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.5;
            color: #fff;
            padding: 12px;
            margin: 0;
            background-color: ${THEME.BLACK};
          }
          .math-container {
            width: 100%;
          }
          h3 {
            font-size: 18px;
            margin: 16px 0 12px 0;
            color: ${THEME.PURPLE};
            font-weight: bold;
          }
          p {
            margin: 10px 0;
            color: #fff;
          }
          .step {
            margin: 14px 0;
          }
          .equation {
            margin: 10px 0;
          }
          strong {
            font-weight: 600;
            color: ${THEME.PURPLE};
          }
          em {
            font-style: italic;
            color: #999;
          }
          ul {
            padding-left: 20px;
            margin: 10px 0;
          }
          li {
            margin-bottom: 8px;
            color: #fff;
          }
          /* Dark-themed math similar to the image */
          .mjx-math {
            color: #fff !important;
          }
          .mjx-chtml {
            margin: 8px 0 !important;
          }
          /* Make sure all MathJax elements are visible on dark background */
          .MathJax {
            color: #fff !important;
          }
          /* Color for variables in equations */
          .mi {
            color: ${THEME.PURPLE} !important;
          }
        </style>
      </head>
      <body>
        <div class="math-container">
          ${formatContent(content)}
        </div>
        <script>
          // Add script to debug and display the content for testing
          document.addEventListener('DOMContentLoaded', function() {
            console.log('Content:', ${JSON.stringify(content)});
          });
          
          // Notify React Native when MathJax has finished rendering
          window.addEventListener('load', function() {
            if (typeof MathJax !== 'undefined') {
              setTimeout(function() {
                window.ReactNativeWebView.postMessage('rendered');
              }, 500);
            }
          });
        </script>
      </body>
    </html>
  `;

  return (
    <View style={[styles.container, style]}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'rendered') {
            setIsLoading(false);
          }
        }}
        onLoadEnd={() => {
          // Fallback timer in case MathJax notification fails
          setTimeout(() => {
            setIsLoading(false);
          }, 1500);
        }}
        scrollEnabled={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={THEME.PURPLE} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.BLACK,
  },
  webview: {
    flex: 1,
    backgroundColor: THEME.BLACK,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
});

export default MathJaxRenderer; 