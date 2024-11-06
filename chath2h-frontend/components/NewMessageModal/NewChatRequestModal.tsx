import Dialog from "@components/Dialog";
import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/router";
import {useSocket} from "../../hooks/useSocket";
import NewChatInvitation from "@components/Mailbox/NewChatInvitation";
import {setGlobalState, useGlobalState} from "../../globalState";
import {useChatRequest} from "../../queries/chatRequestQuery";
import {NewChatInvitationType} from "../../globalTypes";
import {getChatRequest} from "../../queries/chatRequestQuery/chatRequest";

const NewChatRequestModal = () => {
    const router = useRouter();

    const [isDisallowedPage, setIsDisallowedPage] = useState(true);
    const [isHomePage, setIsHomePage] = useState(true);
    const [isChatRequestModalOpen, setIsChatRequestModalOpen] = useState(false);
    const [chatRequests, setChatRequests] = useState([] as NewChatInvitationType[]);
    const [unreadMessagesCount] = useGlobalState('unreadMessagesCount');
    const [filter, setFilter] = useState<string[]>([]);
    const [user] = useGlobalState('user');
    const filteredChatRequests = useMemo(
        () => chatRequests.filter((item) => !filter.includes(item._id)),
        [filter, chatRequests]
    );

    useEffect(() => {
        const disallowedPages = ['/authorization', '/register', '/mailbox', '/chat'];
        const isDisallowedPage = disallowedPages.some((page) => router.pathname.includes(page));
        setIsChatRequestModalOpen(false);
        setIsDisallowedPage(isDisallowedPage);
        setIsHomePage(router.pathname === '/');
    }, [router.pathname]);

    useEffect(() => {
        if (!filteredChatRequests.length) {
            setIsChatRequestModalOpen(false);
        }
    }, [filteredChatRequests]);

    useSocket('ConversationRequest', () => {
        if (!user?._id) return;
        getChatRequest().then((result) => {
            setChatRequests(result);
            setIsChatRequestModalOpen(!!result?.length);
            setGlobalState('unreadMessagesCount', unreadMessagesCount + 1);
        });
    });

    const onTimerEnd = (chatId: string) => {
        setFilter((prev) => [...prev, chatId]);
    }

    if (isDisallowedPage || isHomePage) return <></>;

    return (
        <Dialog isOpen={isChatRequestModalOpen && !!filteredChatRequests.length} handleClose={() => setIsChatRequestModalOpen(false)}>
            <div>
                <NewChatInvitation
                    newInvitationRequest={true}
                    setSendMessageId={() => setIsChatRequestModalOpen(false)}
                    timerEndCallback={onTimerEnd}
                    externalChatRequest={filteredChatRequests}
                    isShortcut
                />
            </div>
        </Dialog>
    );
}

export default NewChatRequestModal;
