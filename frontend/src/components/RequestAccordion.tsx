import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { WebhookRequest } from './types';

const methodColorMap: Record<
  string,
  'info' | 'success' | 'warning' | 'error' | 'default'
> = {
  GET: 'info',
  POST: 'success',
  PUT: 'warning',
  DELETE: 'error',
  PATCH: 'default',
};

export default function RequestAccordion({ logs }: { logs: WebhookRequest[] }) {
  return (
    <>
      {logs.map((req, index) => (
        <Accordion key={index} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ width: '100%' }}>
              <Box display="flex" justifyContent="space-between">
                <Box display={'flex'} alignItems={'center'} gap={1}>
                  <Chip
                    label={req.method}
                    color={methodColorMap[req.method] || 'default'}
                    size="small"
                  />
                  <Typography variant="body1">{req.ip}</Typography>
                </Box>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 0.2 }}
                >
                  {new Date(req.timestamp * 1000).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>

          <AccordionDetails sx={{ px: 2, py: 1 }}>
            {/* Query section */}
            <Divider sx={{ mb: 1 }}>Query Parameters</Divider>
            {req.query_params && Object.keys(req.query_params).length > 0 ? (
              <Box component="dl" sx={{ ml: 1 }}>
                {Object.entries(req.query_params).map(([key, value]) => (
                  <Box key={key} sx={{ display: 'flex', mb: 0.5 }}>
                    <Typography
                      fontSize={18}
                      sx={{
                        minWidth: 100,
                        fontWeight: 'bold',
                        textAlign: 'left',
                        mr: '1',
                      }}
                    >
                      {key}:
                    </Typography>
                    <Typography
                      sx={{
                        wordBreak: 'break-word',
                        color: 'text.secondary',
                        ml: 1,
                      }}
                    >
                      {String(value)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography sx={{ ml: 1, fontStyle: 'italic' }}>
                {'{}'}
              </Typography>
            )}

            {/* Header section */}
            <Divider sx={{ my: 1 }}>Headers</Divider>
            {req.headers && Object.keys(req.headers).length > 0 ? (
              <Box component="dl" sx={{ ml: 1 }}>
                {Object.entries(req.headers).map(([key, value]) => (
                  <Box
                    key={key}
                    sx={{
                      display: 'flex',
                      mb: 0.5,
                      textAlign: 'left',
                      mr: '1',
                    }}
                  >
                    <Typography
                      fontSize={17}
                      sx={{ minWidth: 100, fontWeight: 'bold' }}
                    >
                      {key}:
                    </Typography>
                    <Typography
                      sx={{
                        wordBreak: 'break-word',
                        color: 'text.secondary',
                        ml: 1,
                      }}
                    >
                      {String(value)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography sx={{ ml: 1, fontStyle: 'italic' }}>
                {'{}'}
              </Typography>
            )}

            {/* Body section */}
            <Divider sx={{ my: 1 }}>Body</Divider>
            {req.body && req.body !== '{}' ? (
              <Box component="dl" sx={{ ml: 1 }}>
                {(() => {
                  try {
                    const bodyObj =
                      typeof req.body === 'string'
                        ? JSON.parse(req.body)
                        : req.body;
                    return Object.entries(bodyObj).map(([key, value]) => (
                      <Box
                        key={key}
                        sx={{
                          display: 'flex',
                          mb: 0.5,
                          textAlign: 'left',
                          mr: '1',
                        }}
                      >
                        <Typography
                          fontSize={17}
                          sx={{ minWidth: 100, fontWeight: 'bold' }}
                        >
                          {key}:
                        </Typography>
                        <Typography
                          sx={{
                            wordBreak: 'break-word',
                            color: 'text.secondary',
                            ml: 1,
                          }}
                        >
                          {String(value)}
                        </Typography>
                      </Box>
                    ));
                  } catch {
                    return <Typography sx={{ ml: 1 }}>{req.body}</Typography>;
                  }
                })()}
              </Box>
            ) : (
              <Typography sx={{ ml: 1, fontStyle: 'italic' }}>
                {'{}'}
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
