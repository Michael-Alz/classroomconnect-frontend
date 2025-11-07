import {
	Alert,
	AlertDescription,
	AlertIcon,
	Badge,
	Box,
	Button,
	Card,
	CardBody,
	CardHeader,
	Heading,
	Stack,
	Switch,
	Text,
	useToast,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
	closeSession,
	getSessionDashboard,
	getSessionSubmissions,
	listCourseSessions,
} from '../../api/sessions';
import QRCode from 'react-qr-code';

export function TeacherSessionDashboardPage() {
	const { sessionId } = useParams<{ sessionId: string }>();
	const queryClient = useQueryClient();
	const toast = useToast();

	const sessionQuery = useQuery({
		queryKey: ['sessionDashboard', sessionId],
		queryFn: () => getSessionDashboard(sessionId ?? ''),
		enabled: Boolean(sessionId),
	});

	const submissionsQuery = useQuery({
		queryKey: ['sessionSubmissions', sessionId],
		queryFn: () => getSessionSubmissions(sessionId ?? ''),
		enabled: Boolean(sessionId),
	});

	const sessionListQuery = useQuery({
		queryKey: ['courseSessions', sessionQuery.data?.course_id],
		queryFn: () => listCourseSessions(sessionQuery.data?.course_id ?? ''),
		enabled: Boolean(sessionQuery.data?.course_id),
	});

	const closeMutation = useMutation({
		mutationFn: () => closeSession(sessionId ?? ''),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['sessionDashboard', sessionId],
			});
			if (sessionQuery.data?.course_id) {
				queryClient.invalidateQueries({
					queryKey: ['courseSessions', sessionQuery.data.course_id],
				});
			}
		},
	});

	const sessionMeta = useMemo(() => {
		return sessionListQuery.data?.find(
			(item) => item.session_id === sessionId
		);
	}, [sessionListQuery.data, sessionId]);

	const isSessionOpen = !sessionMeta?.closed_at;

	useEffect(() => {
		if (!isSessionOpen) return;
		const interval = setInterval(() => {
			queryClient.invalidateQueries({
				queryKey: ['sessionDashboard', sessionId],
			});
			queryClient.invalidateQueries({
				queryKey: ['sessionSubmissions', sessionId],
			});
		}, 3000);
		return () => clearInterval(interval);
	}, [isSessionOpen, queryClient, sessionId]);

	const handleCloseSession = () => {
		if (!isSessionOpen) return;
		const confirmed = window.confirm(
			'Closing the session will stop new submissions. Are you sure you want to proceed?'
		);
		if (!confirmed) return;
		closeMutation.mutate();
	};

	const handleCopyLink = async () => {
		if (!sessionMeta) return;
		const joinUrl = `${window.location.origin}/session/run/${sessionMeta.join_token}`;
		if (!navigator?.clipboard?.writeText) {
			toast({
				title: 'Clipboard unavailable',
				description: 'Please copy the link manually.',
				status: 'warning',
				duration: 3000,
				isClosable: true,
			});
			return;
		}
		try {
			await navigator.clipboard.writeText(joinUrl);
			toast({
				title: 'Join link copied',
				status: 'success',
				duration: 2000,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: 'Unable to copy link',
				description:
					error instanceof Error ? error.message : 'Unknown error',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	if (sessionQuery.isLoading) {
		return <Text>Loading session dashboard…</Text>;
	}

	if (sessionQuery.isError || !sessionQuery.data) {
		return (
			<Alert status="error">
				<AlertIcon />
				<AlertDescription>
					Unable to load session dashboard.
				</AlertDescription>
			</Alert>
		);
	}

	const dashboard = sessionQuery.data;

	return (
		<Stack spacing={6}>
			<Card>
				<CardHeader>
					<Heading size="md">{dashboard.course_title}</Heading>
					<Text fontSize="sm" color="gray.500">
						Session {dashboard.session_id}
					</Text>
				</CardHeader>
				<CardBody>
					<Stack spacing={3}>
						<Text>
							Survey required:{' '}
							<strong>
								{dashboard.require_survey ? 'Yes' : 'No'}
							</strong>
						</Text>
						<Stack
							direction={{ base: 'column', sm: 'row' }}
							spacing={2}
						>
							{Object.entries(dashboard.mood_summary).map(
								([mood, count]) => (
									<Badge key={mood} colorScheme="purple">
										{mood}: {count}
									</Badge>
								)
							)}
						</Stack>
						{sessionMeta ? (
							<Stack spacing={2}>
								<Text fontSize="sm" color="gray.600">
									Started{' '}
									{new Date(
										sessionMeta.started_at
									).toLocaleString()}
								</Text>
								<Stack
									direction={{ base: 'column', md: 'row' }}
									spacing={4}
									align="center"
								>
									<Stack spacing={1}>
										<Text fontWeight="bold">
											Join token
										</Text>
										<Badge alignSelf="flex-start">
											{sessionMeta.join_token}
										</Badge>
										<Button
											variant="outline"
											size="sm"
											onClick={handleCopyLink}
										>
											Copy join link
										</Button>
									</Stack>
									{sessionMeta.qr_url ? (
										<Box textAlign="center">
											<QRCode
												value={sessionMeta.qr_url}
												size={128}
											/>
											<Text
												fontSize="xs"
												color="gray.500"
												mt={2}
											>
												Scan to join
											</Text>
										</Box>
									) : null}
									<Stack
										direction="row"
										align="center"
										spacing={3}
									>
										<Text fontWeight="bold">
											Session status
										</Text>
										<Switch
											colorScheme="green"
											isChecked={isSessionOpen}
											onChange={handleCloseSession}
											isDisabled={
												!isSessionOpen ||
												closeMutation.isPending
											}
										/>
										<Text fontSize="sm" color="gray.600">
											{isSessionOpen
												? 'Open for responses'
												: 'Closed'}
										</Text>
									</Stack>
									{closeMutation.isError ? (
										<Text fontSize="xs" color="red.500">
											Unable to close the session. Please
											try again.
										</Text>
									) : null}
								</Stack>
							</Stack>
						) : null}
					</Stack>
				</CardBody>
			</Card>

			<Card>
				<CardHeader>
					<Heading size="sm">Participants</Heading>
				</CardHeader>
				<CardBody>
					{dashboard.participants.length ? (
						<Stack spacing={4}>
							{dashboard.participants.map((participant) => (
								<Card
									key={`${participant.mode}-${participant.display_name}`}
								>
									<CardBody>
										<Stack spacing={2}>
											<Heading size="sm">
												{participant.display_name}
											</Heading>
											<Text fontSize="sm">
												Mode: {participant.mode} | Mood:{' '}
												{participant.mood}
											</Text>
											<Text fontSize="sm">
												Learning style:{' '}
												{participant.learning_style ??
													'n/a'}
											</Text>
											{participant.recommended_activity ? (
												<Stack spacing={1}>
													<Text
														fontWeight="bold"
														fontSize="sm"
													>
														Recommended activity:
													</Text>
													<Text>
														{
															participant
																.recommended_activity
																.activity.name
														}
													</Text>
													<Text
														fontSize="sm"
														color="gray.600"
													>
														{
															participant
																.recommended_activity
																.activity
																.summary
														}
													</Text>
												</Stack>
											) : null}
										</Stack>
									</CardBody>
								</Card>
							))}
						</Stack>
					) : (
						<Text>No participants yet.</Text>
					)}
				</CardBody>
			</Card>

			<Card>
				<CardHeader>
					<Heading size="sm">Submissions</Heading>
					<Text fontSize="xs" color="gray.500">
						Includes student and guest entries for this session.
					</Text>
				</CardHeader>
				<CardBody>
					{submissionsQuery.isLoading ? (
						<Text>Loading submissions…</Text>
					) : submissionsQuery.isError ? (
						<Alert status="error">
							<AlertIcon />
							<AlertDescription>
								Unable to load submissions.
							</AlertDescription>
						</Alert>
					) : submissionsQuery.data?.items.length ? (
						<Stack spacing={3}>
							{submissionsQuery.data.items.map(
								(submission, index) => (
									<Box
										key={index}
										borderWidth="1px"
										borderRadius="md"
										p={4}
									>
										<Stack spacing={1}>
											<Text fontWeight="semibold">
												{submission.student_full_name ||
													submission.student_name ||
													'Guest'}
											</Text>
											<Text
												fontSize="sm"
												color="gray.500"
											>
												Mood: {submission.mood} •
												Learning style:{' '}
												{submission.learning_style ??
													'n/a'}
											</Text>
											<Text
												fontSize="xs"
												color="gray.500"
											>
												Submitted{' '}
												{new Date(
													submission.created_at
												).toLocaleString()}
											</Text>
											<Text fontSize="sm">
												Status: {submission.status}
											</Text>
											{submission.is_baseline_update ? (
												<Badge
													w="fit-content"
													colorScheme="purple"
												>
													Baseline updated
												</Badge>
											) : null}
										</Stack>
									</Box>
								)
							)}
						</Stack>
					) : (
						<Text>No submissions yet.</Text>
					)}
				</CardBody>
			</Card>
		</Stack>
	);
}
