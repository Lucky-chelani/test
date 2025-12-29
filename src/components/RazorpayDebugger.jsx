import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { loadRazorpayScript } from '../services/payment/razorpay';

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);

  /* ADD THIS: Optimize for mobile */
  @media (max-width: 480px) {
    margin: 20px auto; /* Reduce vertical gap */
    padding: 15px;     /* Reduce internal padding */
    width: 95%;        /* Ensure it fills the screen width */
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 5px;
  background-color: ${props => props.error ? '#fff8f8' : '#f9f9f9'};
`;

const SectionTitle = styled.h3`
  color: ${props => props.error ? '#c53030' : '#2d3748'};
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;

const StatusIcon = styled.span`
  color: ${props => props.success ? '#38a169' : '#e53e3e'};
  margin-right: 10px;
  font-size: 1.2em;
`;

const InfoBox = styled.div`
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-wrap: break-word;
  font-family: monospace;
  max-height: 200px;
  overflow-y: auto;
`;

const Button = styled.button`
  background-color: #3399cc;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  
  &:hover {
    background-color: #2388bb;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const List = styled.ul`
  margin: 10px 0;
  padding-left: 20px;
`;

const ListItem = styled.li`
  margin-bottom: 8px;
  font-family: monospace;
  font-size: 14px;
`;

const CodeBlock = styled.pre`
  background-color: #f0f0f0;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: monospace;
  font-size: 14px;
  margin: 10px 0;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  background-color: ${props => props.success ? '#c6f6d5' : props.warning ? '#fefcbf' : '#fed7d7'};
  color: ${props => props.success ? '#22543d' : props.warning ? '#744210' : '#822727'};
  font-size: 12px;
  margin-left: 8px;
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  margin-top: 5px;
  font-size: 14px;
`;

const RazorpayDebugger = () => {
  const [state, setState] = useState({
    keyInfo: {
      keyId: process.env.REACT_APP_RAZORPAY_KEY_ID || 'Not found',
      hasSecret: !!process.env.REACT_APP_RAZORPAY_SECRET,
    },
    scriptStatus: {
      isLoaded: false,
      loadAttempted: false,
      error: null
    },
    testResults: null,
    networkTest: null,
    loadingScript: false,
    testingNetwork: false
  });
  
  useEffect(() => {
    checkRazorpayScript();
  }, []);
  
  const checkRazorpayScript = () => {
    const isLoaded = typeof window.Razorpay !== 'undefined';
    const scriptElement = document.getElementById('razorpay-checkout-js');
    
    setState(prev => ({
      ...prev,
      scriptStatus: {
        isLoaded,
        loadAttempted: true,
        scriptElement: scriptElement ? true : false
      }
    }));
  };
  
  const loadScriptFromSdk = async () => {
    setState(prev => ({
      ...prev,
      loadingScript: true,
      scriptStatus: {
        ...prev.scriptStatus,
        error: null
      }
    }));
    
    try {
      const result = await loadRazorpayScript();
      
      setState(prev => ({
        ...prev,
        loadingScript: false,
        scriptStatus: {
          isLoaded: result,
          loadAttempted: true,
          error: result ? null : 'Failed to load script from SDK'
        }
      }));
      
      checkRazorpayScript();
    } catch (error) {
      setState(prev => ({
        ...prev,
        loadingScript: false,
        scriptStatus: {
          isLoaded: false,
          loadAttempted: true,
          error: error.message || 'Unknown error loading script'
        }
      }));
    }
  };
  
  const loadScriptManually = async () => {
    setState(prev => ({
      ...prev,
      loadingScript: true,
      scriptStatus: {
        ...prev.scriptStatus,
        error: null
      }
    }));
    
    try {
      // Remove any existing script to avoid duplicates
      const existingScript = document.getElementById('razorpay-checkout-js');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Create and add the script
      const script = document.createElement('script');
      script.id = 'razorpay-checkout-js';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      
      // Create a promise to track script loading
      const loadPromise = new Promise((resolve, reject) => {
        script.onload = () => resolve(true);
        script.onerror = (error) => reject(new Error('Script failed to load'));
      });
      
      document.body.appendChild(script);
      
      // Wait for script to load
      await loadPromise;
      
      setState(prev => ({
        ...prev,
        loadingScript: false,
        scriptStatus: {
          isLoaded: true,
          loadAttempted: true,
          error: null
        }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loadingScript: false,
        scriptStatus: {
          isLoaded: false,
          loadAttempted: true,
          error: error.message || 'Unknown error loading script'
        }
      }));
    }
  };
  
  const testNetworkConnectivity = async () => {
    setState(prev => ({
      ...prev,
      testingNetwork: true,
      networkTest: null
    }));
    
    try {
      // Test connection to Razorpay CDN
      const cdnStartTime = performance.now();
      const cdnResponse = await fetch('https://checkout.razorpay.com/v1/checkout.js', { 
        method: 'HEAD',
        mode: 'no-cors' // This will make the request succeed even if CORS is restricted
      });
      const cdnEndTime = performance.now();
      const cdnTime = cdnEndTime - cdnStartTime;
      
      // Test connection to Razorpay API
      const apiStartTime = performance.now();
      const apiResponse = await fetch('https://api.razorpay.com/v1/public', { 
        method: 'HEAD',
        mode: 'no-cors' // This will make the request succeed even if CORS is restricted
      });
      const apiEndTime = performance.now();
      const apiTime = apiEndTime - apiStartTime;
      
      setState(prev => ({
        ...prev,
        testingNetwork: false,
        networkTest: {
          cdn: {
            status: 'completed',
            time: Math.round(cdnTime)
          },
          api: {
            status: 'completed',
            time: Math.round(apiTime)
          }
        }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        testingNetwork: false,
        networkTest: {
          error: error.message || 'Network test failed'
        }
      }));
    }
  };
  
  const testMinimalIntegration = () => {
    try {
      if (!window.Razorpay) {
        setState(prev => ({
          ...prev,
          testResults: {
            success: false,
            error: 'Razorpay script not loaded'
          }
        }));
        return;
      }
      
      // Create the most minimal possible options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: 10000, // 100 INR (minimum)
        currency: "INR",
        name: 'Debug Test',
        description: 'Testing basic integration',
        handler: function(response) {
          setState(prev => ({
            ...prev,
            testResults: {
              success: true,
              response
            }
          }));
        },
      };
      
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function(response) {
        setState(prev => ({
          ...prev,
          testResults: {
            success: false,
            error: response.error
          }
        }));
      });
      
      rzp.open();
    } catch (error) {
      setState(prev => ({
        ...prev,
        testResults: {
          success: false,
          error: error.toString()
        }
      }));
    }
  };
  
  return (
    <Container>
      <Title>Razorpay Integration Debugger</Title>
      
      <Section>
        <SectionTitle>
          <StatusIcon success={!!state.keyInfo.keyId && state.keyInfo.keyId !== 'Not found'}>
            {state.keyInfo.keyId && state.keyInfo.keyId !== 'Not found' ? '✅' : '❌'}
          </StatusIcon>
          Environment Configuration
        </SectionTitle>
        <List>
          <ListItem>
            Key ID: {state.keyInfo.keyId}
            {state.keyInfo.keyId === 'Not found' && (
              <Badge>Missing</Badge>
            )}
          </ListItem>
          <ListItem>
            Has Secret Key: {state.keyInfo.hasSecret ? 'Yes' : 'No'}
            {state.keyInfo.hasSecret && (
              <Badge warning>Should only be on server</Badge>
            )}
          </ListItem>
        </List>
      </Section>
      
      <Section>
        <SectionTitle>
          <StatusIcon success={state.scriptStatus.isLoaded}>
            {state.scriptStatus.isLoaded ? '✅' : '❌'}
          </StatusIcon>
          Script Status
        </SectionTitle>
        <List>
          <ListItem>Script Loaded: {state.scriptStatus.isLoaded ? 'Yes' : 'No'}</ListItem>
          <ListItem>Load Attempted: {state.scriptStatus.loadAttempted ? 'Yes' : 'No'}</ListItem>
          <ListItem>Script Element: {state.scriptStatus.scriptElement ? 'Present in DOM' : 'Not found'}</ListItem>
          <ListItem>Razorpay Object: {typeof window.Razorpay !== 'undefined' ? 'Available' : 'Not available'}</ListItem>
        </List>
        
        {state.scriptStatus.error && (
          <ErrorMessage>{state.scriptStatus.error}</ErrorMessage>
        )}
        
        <div style={{ marginTop: '10px' }}>
          <Button 
            onClick={loadScriptFromSdk} 
            disabled={state.loadingScript}
          >
            {state.loadingScript ? 'Loading...' : 'Load with SDK'}
          </Button>
          <Button 
            onClick={loadScriptManually} 
            disabled={state.loadingScript}
          >
            Manual Script Load
          </Button>
          <Button onClick={checkRazorpayScript}>Re-check Status</Button>
        </div>
      </Section>
      
      <Section>
        <SectionTitle>Network Connectivity</SectionTitle>
        <div>
          <Button 
            onClick={testNetworkConnectivity}
            disabled={state.testingNetwork}
          >
            {state.testingNetwork ? 'Testing...' : 'Test Connectivity'}
          </Button>
        </div>
        
        {state.networkTest && !state.networkTest.error && (
          <List style={{ marginTop: '10px' }}>
            <ListItem>
              CDN Response Time: {state.networkTest.cdn.time}ms
              {state.networkTest.cdn.time > 1000 ? (
                <Badge warning>Slow</Badge>
              ) : (
                <Badge success>Good</Badge>
              )}
            </ListItem>
            <ListItem>
              API Response Time: {state.networkTest.api.time}ms
              {state.networkTest.api.time > 1000 ? (
                <Badge warning>Slow</Badge>
              ) : (
                <Badge success>Good</Badge>
              )}
            </ListItem>
          </List>
        )}
        
        {state.networkTest?.error && (
          <ErrorMessage>{state.networkTest.error}</ErrorMessage>
        )}
      </Section>
      
      <Section>
        <SectionTitle>Test Integration</SectionTitle>
        <div>
          <Button 
            onClick={testMinimalIntegration}
            disabled={!state.scriptStatus.isLoaded}
          >
            Test Basic Integration
          </Button>
        </div>
        
        {state.testResults && (
          <div style={{ marginTop: '10px' }}>
            <SectionTitle>
              <StatusIcon success={state.testResults.success}>
                {state.testResults.success ? '✅' : '❌'}
              </StatusIcon>
              Test Results
            </SectionTitle>
            
            {state.testResults.success ? (
              <CodeBlock>
                {JSON.stringify(state.testResults.response, null, 2)}
              </CodeBlock>
            ) : (
              <ErrorMessage>
                <CodeBlock>
                  {JSON.stringify(state.testResults.error, null, 2)}
                </CodeBlock>
              </ErrorMessage>
            )}
          </div>
        )}
      </Section>
      
      <Section>
        <SectionTitle>Browser Information</SectionTitle>
        <CodeBlock>
          {`User Agent: ${navigator.userAgent}
Platform: ${navigator.platform}
Language: ${navigator.language}
Cookie Enabled: ${navigator.cookieEnabled}
Online: ${navigator.onLine}`}
        </CodeBlock>
      </Section>
    </Container>
  );
};

export default RazorpayDebugger;
