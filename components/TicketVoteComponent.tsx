import { api } from '@/lib/api';
import { Performer } from '@/types/nejat';
import { Feather, FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { zodResolver } from '@hookform/resolvers/zod';
import { Picker } from '@react-native-picker/picker';
import { useQuery } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image, KeyboardAvoidingView, Platform, Modal as RNModal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { z } from "zod";

interface PerformerSelected {
    id: string;
    firstname?: string;
    lastname?: string;
    nickname?: string;
}

interface TicketEvents {
    id: string;
    venue: {
        name: string;
    };
}

const makeTicketSchema = z.object({
    fullName: z.string().min(6),
    email: z.email(),
    ticketTitle: z.string().min(6),
    event: z.string().optional(),
    ticketDescription: z.string().min(10),
    ticketImage: z.string().optional().nullable(),
})

const TicketVoteComponent = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [performersDialog, setPerformersDialog] = useState(false);
    const [ticketDialog, setTicketDialog] = useState(false);
    const [openPerformersPopover, setOpenPerformersPopover] = useState(false);
    const [performerSelected, setPerformerSelected] = useState<PerformerSelected | null>(null);

    const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<z.infer<typeof makeTicketSchema>>({
        resolver: zodResolver(makeTicketSchema),
        defaultValues: useMemo(() => ({
            fullName: "",
            email: "",
            ticketTitle: "",
            event: "",
            ticketDescription: "",
            ticketImage: "",
        }), []),
        mode: "onChange"
    });

    const { data: performersData, isLoading, isError, refetch } = useQuery({
        queryKey: ['performersVote'],
        queryFn: async () => {
            const response = await api.get<Performer[]>(`/nejat/performers`);
            return response.data;
        },
        staleTime: 12000000,
        refetchOnWindowFocus: false,
        retry: 2,
        enabled: performersDialog
    });

    const { data: eventsData, isLoading: eventsLoading, isError: eventsError } = useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const response = await api.get<TicketEvents[]>(`/nejat/ticketEvents`);
            return response.data;
        },
        refetchOnWindowFocus: false,
        retry: 2,
        staleTime: 12000000,
        enabled: ticketDialog
    });

    useEffect(() => {
        if (!ticketDialog) {
            reset();
            setImagePreview(null);
        }
    }, [ticketDialog]);

    useEffect(() => {
        if (performersDialog) {
            setTicketDialog(false);
        } else {
            setPerformerSelected(null);
        }
    }, [performersDialog]);

    const onSubmit = useCallback(async (data: z.infer<typeof makeTicketSchema>) => {
        try {
            const response = await api.post(`/nejat/createTicket`, {
                fullName: data.fullName,
                email: data.email,
                ticketTitle: data.ticketTitle,
                ticketDescription: data.ticketDescription,
                base64Data: data.ticketImage ? {
                    base64: data.ticketImage,
                    subfolder: "tickets",
                    filename: `tickets-${Date.now()}`
                } : null
            });
            if (response.data.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Successfully created ticket, we will contact you ASAP.'
                });
                setTicketDialog(false);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Something went wrong. Please try again!'
            });
        }
    }, []);

    const votePerformer = useCallback(async (prfSelected: PerformerSelected) => {
        try {
            const response = await api.patch(`/nejat/performerVote/${prfSelected.id}`);
            if (response.data.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: `${prfSelected?.firstname ? prfSelected.firstname + " " + prfSelected.lastname : prfSelected?.nickname} voted successfully!`
                });
                setTimeout(() => {
                    setPerformersDialog(false);
                }, 100);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Something went wrong voting performer. Please try again!'
            });
        }
    }, []);

    const pickImage = async (onChange: (value: string) => void) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });

        if (!result.canceled && result.assets[0].base64) {
            const base64String = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setImagePreview(base64String);
            onChange(base64String);
        }
    };

    const deleteImage = async (onChange: (value: string) => void) => {
        setImagePreview(null);
        onChange("")
    }

    return (
        <View style={styles.container}>
            {/* Ticket Modal */}
            <RNModal
                visible={ticketDialog}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setTicketDialog(false)}
            >
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setTicketDialog(false)} className='absolute right-4 top-4'>
                                <AntDesign name="closecircle" size={24} color="#eab308" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Create Tickets</Text>
                            <Text style={styles.modalDescription}>Create Tickets for support or adding specific event feedbacks.</Text>
                        </View>
                        
                        <ScrollView style={styles.modalBody}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Your Full Name</Text>
                                <Controller
                                    control={control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Type your name here..."
                                            value={field.value}
                                            onChangeText={field.onChange}
                                        />
                                    )}
                                />
                                {errors.fullName && (
                                    <Text style={styles.errorText}>{errors.fullName.message}</Text>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Your Email</Text>
                                <Controller
                                    control={control}
                                    name="email"
                                    render={({ field }) => (
                                        <TextInput
                                            style={styles.input}
                                            placeholder="user@example.com"
                                            keyboardType="email-address"
                                            value={field.value}
                                            onChangeText={field.onChange}
                                        />
                                    )}
                                />
                                {errors.email && (
                                    <Text style={styles.errorText}>{errors.email.message}</Text>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Select Event<Text style={styles.optionalText}>/optional</Text></Text>
                                <Controller
                                    control={control}
                                    name="event"
                                    render={({ field }) => (
                                        <View style={styles.pickerContainer}>
                                            <Picker
                                                selectedValue={field.value}
                                                onValueChange={field.onChange}
                                                style={styles.picker}
                                            >
                                                <Picker.Item label="Make ticket for event" value="" />
                                                {eventsError ? (
                                                    <Picker.Item label="Something went wrong" value="error" enabled={false} />
                                                ) : eventsLoading ? (
                                                    <Picker.Item label="Loading..." value="loading" enabled={false} />
                                                ) : (!eventsData || eventsData.length === 0) ? (
                                                    <Picker.Item label="No venues found, create one" value="no-data" enabled={false} />
                                                ) : (
                                                    eventsData.map((event) => (
                                                        <Picker.Item key={event.id} label={event.venue.name} value={event.id} />
                                                    ))
                                                )}
                                            </Picker>
                                        </View>
                                    )}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Ticket Title</Text>
                                <Controller
                                    control={control}
                                    name="ticketTitle"
                                    render={({ field }) => (
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Meaningful Ticket Title"
                                            value={field.value}
                                            onChangeText={field.onChange}
                                        />
                                    )}
                                />
                                {errors.ticketTitle && (
                                    <Text style={styles.errorText}>{errors.ticketTitle.message}</Text>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Ticket Description</Text>
                                <Controller
                                    control={control}
                                    name="ticketDescription"
                                    render={({ field }) => (
                                        <TextInput
                                            style={[styles.input, styles.textArea]}
                                            placeholder="Reason/Explanation of your Ticket Description"
                                            multiline
                                            numberOfLines={4}
                                            value={field.value}
                                            onChangeText={field.onChange}
                                        />
                                    )}
                                />
                                {errors.ticketDescription && (
                                    <Text style={styles.errorText}>{errors.ticketDescription.message}</Text>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Ticket Image<Text style={styles.optionalText}>/optional</Text></Text>
                                <Controller
                                    control={control}
                                    name="ticketImage"
                                    render={({ field }) => (
                                        <>
                                            <TouchableOpacity 
                                                style={styles.imageButton}
                                                onPress={() => pickImage(field.onChange)}
                                            >
                                                <Text style={styles.imageButtonText}>
                                                    {field.value ? "Change Image" : "Add Ticket Image"}
                                                </Text>
                                            </TouchableOpacity>

                                            {imagePreview && (
                                                <View className='relative'>
                                                    <Image
                                                        source={{ uri: imagePreview }}
                                                        style={styles.imagePreview}
                                                    />
                                                    <TouchableOpacity onPress={() => deleteImage(field.onChange)} className='absolute -right-2 top-1'>
                                                        <AntDesign name="closecircle" size={24} color="red" />
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        </>
                                    )}
                                />
                                {errors.ticketImage && (
                                    <Text style={styles.errorText}>{errors.ticketImage.message}</Text>
                                )}
                            </View>
                        </ScrollView>

                        <View style={styles.modalFooter} className='w-full flex-row gap-2'>
                            <TouchableOpacity
                                // style={[styles.button, styles.submitButton]}
                                className='bg-yellow-600 flex-1 rounded-md py-2.5 flex-row items-center justify-center'
                                disabled={isSubmitting}
                                onPress={handleSubmit(onSubmit)}
                            >
                                <Text style={styles.buttonText}>
                                    {isSubmitting ? "Submitting Ticket" : "Submit Ticket"}
                                </Text>
                                <MaterialIcons name="send" size={20} color="white" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                // style={[styles.button, styles.voteButton]}
                                className='bg-black flex-1 rounded-md flex-row py-2.5 items-center justify-center'
                                onPress={() => {
                                    setPerformersDialog(true);
                                    setTicketDialog(false);
                                }}
                            >
                                <Text style={styles.buttonText}>Vote Performers</Text>
                                <MaterialCommunityIcons name="microphone" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </RNModal>

            {/* Performers Modal */}
            <RNModal
                visible={performersDialog}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setPerformersDialog(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setPerformersDialog(false)} className='absolute right-4 top-4'>
                                <AntDesign name="closecircle" size={24} color="#eab308" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Vote your desired performers</Text>
                            <Text style={styles.modalDescription}>
                                You can make up to 5 votes every 24 hours. Vote your preferred performer/singer so that Venues/Clubs will be notified which is more liked.
                            </Text>
                        </View>

                        <View style={styles.modalBody}>
                            <View style={styles.performerSelection}>
                                {isLoading ? (
                                    <View style={styles.loadingContainer}>
                                        <Text>Loading performers...</Text>
                                    </View>
                                ) : isError ? (
                                    <View>
                                        <Text style={styles.errorText}>Something went wrong, please try again by clicking this button</Text>
                                        <TouchableOpacity
                                            style={[styles.button, styles.tryAgainButton]}
                                            onPress={() => refetch()}
                                        >
                                            <Text style={styles.buttonText}>Try Again</Text>
                                            <Feather name="refresh-ccw" size={20} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                ) : !performersData ? (
                                    <Text style={styles.errorText}>No data is available.</Text>
                                ) : (
                                    <>
                                        <TouchableOpacity
                                            style={styles.performerDropdown}
                                            onPress={() => setOpenPerformersPopover(!openPerformersPopover)}
                                        >
                                            <Text style={styles.performerDropdownText}>
                                                {performerSelected ? (
                                                    (performerSelected.firstname && performerSelected.lastname) 
                                                        ? performerSelected.firstname + " " + performerSelected.lastname 
                                                        : performerSelected.nickname
                                                ) : "Select a performer..."}
                                            </Text>
                                            <MaterialIcons 
                                                name={openPerformersPopover ? "arrow-drop-up" : "arrow-drop-down"} 
                                                size={24} 
                                                color="black" 
                                            />
                                        </TouchableOpacity>

                                        {openPerformersPopover && (
                                            <View style={styles.performerList}>
                                                <ScrollView style={styles.performerScrollView}>
                                                    {performersData.map((performer) => (
                                                        <TouchableOpacity
                                                            key={performer.id}
                                                            style={styles.performerItem}
                                                            onPress={() => {
                                                                setPerformerSelected(
                                                                    performerSelected?.id === performer.id
                                                                        ? null
                                                                        : {
                                                                            id: performer.id,
                                                                            firstname: performer.firstName,
                                                                            lastname: performer.lastName,
                                                                            nickname: performer.nickname
                                                                        }
                                                                );
                                                                setOpenPerformersPopover(false);
                                                            }}
                                                        >
                                                            <Text style={styles.performerItemText}>
                                                                {(performer.firstName && performer.lastName) 
                                                                    ? `${performer.firstName} ${performer.lastName}` 
                                                                    : performer.nickname}
                                                            </Text>
                                                            {performerSelected?.id === performer.id && (
                                                                <MaterialIcons name="check" size={20} color="green" />
                                                            )}
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            </View>
                                        )}

                                        {performerSelected && (
                                            <TouchableOpacity   
                                                // style={[styles.button, styles.voteButton, styles.voteActionButton]}
                                                className='bg-yellow-600 rounded-md items-center flex-row justify-center py-2'
                                                onPress={() => votePerformer(performerSelected)}
                                            >
                                                <Text style={styles.buttonText}>Vote Up</Text>
                                                <FontAwesome5 name="check" size={20} color="white" />
                                            </TouchableOpacity>
                                        )}
                                    </>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            </RNModal>

            {/* Floating Button */}
            <TouchableOpacity
                onPress={() => setTicketDialog(true)}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={[
                        '#fbbf24', // Amber-400 (lighter yellow)
            '#f59e0b', // Yellow-500 (base)
            '#f97316', // Orange-500 (warm accent)
            '#eab308', // Yellow-600 (deeper tone)
            '#84cc16',
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.fancyButton}
                >
                    <View style={styles.fancyButtonInner}>
                        <FontAwesome name="bookmark" size={24} color="white" />
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        zIndex: 1000,
    },
    fancyButton: {
        borderRadius: 30, // circular button
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    fancyButtonInner: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)', // slight inner glow
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
    },
    modalHeader: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#1f2937',
    },
    modalDescription: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 8,
    },
    modalBody: {
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        color: '#374151',
    },
    optionalText: {
        fontSize: 12,
        color: '#9ca3af',
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: 'white',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: 'white',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    imageButton: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    imageButtonText: {
        fontSize: 16,
        color: '#374151',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginTop: 10,
        borderRadius: 8,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    submitButton: {
        backgroundColor: '#3b82f6',
        flex: 1,
        marginRight: 8,
    },
    voteButton: {
        backgroundColor: '#8b5cf6',
        flex: 1,
    },
    voteActionButton: {
        marginTop: 16,
    },
    tryAgainButton: {
        backgroundColor: '#ef4444',
        marginTop: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        marginRight: 8,
        fontWeight: '500',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: 4,
    },
    performerSelection: {
        padding: 20,
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    performerDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        backgroundColor: 'white',
    },
    performerDropdownText: {
        fontSize: 16,
        color: '#374151',
    },
    performerList: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        maxHeight: 200,
        marginBottom: 16,
        backgroundColor: 'white',
    },
    performerScrollView: {
        padding: 8,
    },
    performerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    performerItemText: {
        fontSize: 16,
        color: '#374151',
    },
});

export default memo(TicketVoteComponent);