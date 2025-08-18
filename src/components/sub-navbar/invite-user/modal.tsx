import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalBody,
  ModalOverlay,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Box,
  Text,
  VStack,
  HStack,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image
} from '@chakra-ui/react';
import checkEnvironment from '@/util/check-environment';
import { useAppSelector } from '@/src/hooks';
import shortId from 'shortid';
import uniqid from 'uniqid';

const host = checkEnvironment();

const InviteModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const board = useAppSelector((state) => state.board.board);
  const toast = useToast();

  const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');

  const generateInviteLink = async () => {
    if (!email || !validEmail.test(email)) return;

    setIsGenerating(true);

    // Generate token and store in database (same as email system)
    const token = uniqid();
    const id = shortId.generate();

    try {
      // Store token in database
      const response = await fetch(`${host}/api/generate-invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          userId: id,
          email,
          boardId: board._id
        })
      });

      if (response.ok) {
        // Generate the invite link
        const link = `${host}/signup?token=${token}&email=${email}&boardId=${board._id}`;
        setInviteLink(link);

        // Generate QR code using QR Server API (free)
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          link
        )}`;
        setQrCodeUrl(qrUrl);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate invite link',
        status: 'error',
        duration: 3000
      });
    }

    setIsGenerating(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast({
        title: 'Copied!',
        description: 'Invite link copied to clipboard',
        status: 'success',
        duration: 2000
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy link',
        status: 'error',
        duration: 3000
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const resetModal = () => {
    setEmail('');
    setInviteLink('');
    setQrCodeUrl('');
  };

  return (
    <>
      <Button onClick={onOpen} size="xs" ml="5px">
        Invite
      </Button>
      <Modal
        onClose={() => {
          onClose();
          resetModal();
        }}
        isOpen={isOpen}
        size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invite User to Board</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text mb={2} fontSize="sm" fontWeight="medium">
                  Enter the email address of the person you want to invite:
                </Text>
                <Input
                  type="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="user@example.com"
                />
              </Box>

              {!inviteLink ? (
                <Button
                  disabled={!email || !validEmail.test(email)}
                  colorScheme="blue"
                  onClick={generateInviteLink}
                  isLoading={isGenerating}
                  loadingText="Generating...">
                  Generate Invite Link
                </Button>
              ) : (
                <Tabs variant="enclosed">
                  <TabList>
                    <Tab>Share Link</Tab>
                    <Tab>QR Code</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <VStack spacing={3}>
                        <Text fontSize="sm" color="gray.600">
                          Copy and share this link with {email}:
                        </Text>
                        <Box
                          p={3}
                          bg="gray.100"
                          borderRadius="md"
                          wordBreak="break-all"
                          fontSize="sm">
                          {inviteLink}
                        </Box>
                        <Button colorScheme="green" onClick={copyToClipboard} size="sm">
                          Copy Link
                        </Button>
                      </VStack>
                    </TabPanel>
                    <TabPanel>
                      <VStack spacing={3}>
                        <Text fontSize="sm" color="gray.600">
                          Scan this QR code to join the board:
                        </Text>
                        {qrCodeUrl && (
                          <Image
                            src={qrCodeUrl}
                            alt="Invite QR Code"
                            borderRadius="md"
                            boxShadow="md"
                          />
                        )}
                        <Text fontSize="xs" color="gray.500" textAlign="center">
                          The QR code contains the same invite link
                        </Text>
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => {
                onClose();
                resetModal();
              }}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default InviteModal;
