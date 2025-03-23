import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    Pressable,
    useWindowDimensions,
} from 'react-native';
import {
    Send,
    Check,
    CheckCheck,
    ChevronLeft,
    MessageSquare,
} from 'lucide-react-native';
import { useState, useRef, useEffect } from 'react';
import { Message } from '../../types';

function MessageStatus({ status }: { status: string }) {
    switch (status) {
        case 'sent':
            return <Check size={16} color="#9AA0A6" />;
        case 'delivered':
            return <CheckCheck size={16} color="#9AA0A6" />;
        case 'read':
            return <CheckCheck size={16} color="#34A853" />;
        default:
            return null;
    }
}

interface ChatAreaProps {
    messages: Message[];
    userId: string;
    onSend: (message: string) => void;
    onBack?: () => void;
}

export function ChatArea({ messages, userId, onBack, onSend }: ChatAreaProps) {
    const [newMessage, setNewMessage] = useState('');
    const flatListRef = useRef<FlatList>(null);
    const { width } = useWindowDimensions();
    const isDesktop = width >= 1024;

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    if (!messages || messages.length === 0) {
        // On desktop show empty state if no messages; on mobile this is not rendered.
        return isDesktop ? (
            <View style={styles.emptyChatContainer}>
                <MessageSquare size={48} color="#9AA0A6" />
                <Text style={styles.emptyChatText}>
                    Sélectionnez votre contact pour voir la conversation
                </Text>
            </View>
        ) : null;
    }

    const renderMessage = ({ item }: { item: Message }) => (
        <View
            style={[
                styles.messageContainer,
                item.senderId == userId ? styles.ownMessage : styles.otherMessage,
            ]}
        >
            <View
                style={[
                    styles.messageBubble,
                    item.senderId == userId ? styles.ownBubble : styles.otherBubble,
                ]}
            >
                <Text
                    style={[
                        styles.messageText,
                        item.senderId == userId ? styles.ownMessageText : styles.otherMessageText,
                    ]}
                >
                    {item.message}
                </Text>
                <View style={styles.messageFooter}>
                    <Text
                        style={[
                            styles.messageTimestamp,
                            item.senderId == userId ? styles.ownTimestamp : styles.otherTimestamp,
                        ]}
                    >
                        {item.timestamp}
                    </Text>
                    {item.senderId == userId && <MessageStatus status={item.status} />}
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.chatArea}>
            <View style={styles.chatHeader}>
                {!isDesktop && onBack && (
                    <Pressable style={styles.backButton} onPress={onBack}>
                        {/* <Text style={styles.backButtonText}>Retour</Text> */}
                        <ChevronLeft size={20} color="#666666" />
                    </Pressable>
                )}
                <Text style={styles.chatHeaderTitle}>{messages.find((message) => message.senderId !== userId)?.sender}</Text>
            </View>
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messageList}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Écrivez votre message..."
                    multiline
                />
                <Pressable
                    style={[styles.sendButton, !newMessage && styles.sendButtonDisabled]}
                    disabled={!newMessage}
                    onPress={() => onSend(newMessage)}
                >
                    <Send size={20} color={newMessage ? '#FFFFFF' : '#9AA0A6'} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    emptyChatContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
    },
    emptyChatText: {
        marginTop: 16,
        fontSize: 16,
        color: '#5F6368',
        textAlign: 'center',
    },
    chatArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E8EAED',
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        marginRight: 12,
        padding: 8,
        backgroundColor: '#F1F3F4',
        borderRadius: 4,
    },
    chatHeaderTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#202124',
    },
    messageList: {
        padding: 16,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        maxWidth: '80%',
    },
    ownMessage: {
        flexDirection: 'row-reverse',
        alignSelf: 'flex-end',
    },
    otherMessage: {
        alignSelf: 'flex-start',
    },
    messageBubble: {
        padding: 12,
        borderRadius: 16,
        maxWidth: '100%',
    },
    ownBubble: {
        backgroundColor: '#1A73E8',
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: '#F1F3F4',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        marginBottom: 4,
    },
    ownMessageText: {
        color: '#FFFFFF',
    },
    otherMessageText: {
        color: '#202124',
    },
    messageFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 4,
    },
    messageTimestamp: {
        fontSize: 12,
    },
    ownTimestamp: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    otherTimestamp: {
        color: '#5F6368',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E8EAED',
        backgroundColor: '#FFFFFF',
    },
    input: {
        flex: 1,
        marginRight: 12,
        padding: 12,
        backgroundColor: '#F1F3F4',
        borderRadius: 24,
        fontSize: 16,
        maxHeight: 100,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1A73E8',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#F1F3F4',
    },
});
