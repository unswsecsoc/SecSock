import Navbar from './Navbar';
import Footer from './Footer';
import { Box, Link, List, ListItem, Typography } from '@mui/material';

function Learn({ toggleTheme, mode }: { toggleTheme: () => void; mode: 'light' | 'dark' }) {
  return (
    <Box
      sx={{
        // These attributes allow the footer to stick to the bottom and text to be below the navbar
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        mt: '10vh'
      }}
    >
      <Navbar toggleTheme={toggleTheme} mode={mode} />

      <Box sx={{mx: '5vw'}}>
      {/* Title */}
      <Typography variant="h2" gutterBottom fontWeight="bold">
        Learn with SecSock
      </Typography>

      {/* Intro */}
      <Typography variant="body1" fontSize={20}>
        SecSock is a tool built for <strong>security education</strong>. It
        gives you a safe place to send requests and see exactly what data an
        attacker could capture. In real exploits, webhooks are often used as
        <em> exfiltration endpoints</em> — where stolen data gets sent after a
        vulnerability is exploited.
      </Typography>

      {/* Exploit Examples */}
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        🔎 How Webhooks Are Used in Exploits
      </Typography>
      <Typography variant="body1" fontSize={20}>
        Attackers rarely just pop an alert box — they want to{' '}
        <strong>steal data</strong>. A webhook provides an easy way to send
        captured information back to them. For example:
      </Typography>
      <List>
        <ListItem>
          <Typography variant="body1" fontSize={20}>
            <strong>Cross-Site Scripting (XSS)</strong>: An attacker injects a
            script that runs in a victim’s browser and sends their cookies to a
            webhook endpoint they control. This will allow the attacker to login
            as any users that stumbles across their payload
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1" fontSize={20}>
            <strong>Server-Side Request Forgery (SSRF)</strong>: A vulnerable
            server makes requests on behalf of the attacker, who uses a webhook
            to receive sensitive internal responses (e.g. credentials).
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1" fontSize={20}>
            <strong>Blind Injection (SQLi, XXE, etc.)</strong>: When the
            attacker can’t directly see the output, they encode the results and
            send them to a webhook for exfiltration.
          </Typography>
        </ListItem>
      </List>

      {/* Practice Section */}
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        🧪 Practice These Skills
      </Typography>
      <Typography variant="body1" fontSize={20}>
        To really understand how webhooks are used in security exploits, try
        these hands-on labs:
      </Typography>
      <List sx={{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center', // centers horizontally
  }}>
        <ListItem>
          <Link
            href="https://portswigger.net/web-security/cross-site-scripting/exploiting/lab-stealing-cookies"
            target="_blank"
            rel="noopener"
          >
            PortSwigger: Exploiting XSS to Steal Cookies
          </Link>
        </ListItem>
        <ListItem>
          <Link
            href="https://portswigger.net/web-security/ssrf"
            target="_blank"
            rel="noopener"
          >
            PortSwigger: Server-Side Request Forgery Labs
          </Link>
        </ListItem>
        <ListItem>
          <Link
            href="https://portswigger.net/web-security/sql-injection/blind"
            target="_blank"
            rel="noopener"
          >
            PortSwigger: Blind SQL Injection
          </Link>
        </ListItem>
        <ListItem>
          <Link
            href="https://owasp.org/www-project-juice-shop/"
            target="_blank"
            rel="noopener"
          >
            OWASP Juice Shop (XSS, Injection, SSRF practice)
          </Link>
        </ListItem>
      </List>

      {/* Takeaway */}
      <Typography variant="body1" fontSize={20} sx={{ mt: 4 }}>
        By combining SecSock with these labs, you’ll see how attackers
        <strong> collect stolen data</strong> during an exploit. This knowledge
        helps defenders recognize real-world attack patterns and build safer
        applications.
      </Typography>
    </Box>
      <Footer />
    </Box>
  );
}

export default Learn;
