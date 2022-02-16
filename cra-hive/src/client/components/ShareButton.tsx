import { Button, Icon } from 'semantic-ui-react'
import { useState } from 'react'

export default function ShareButton() {
    const [copied, setCopied] = useState(false);
    const [shared, setShared] = useState(false);
    let inviteLink = document.URL;
    if (inviteLink.match("team=white")) {
        inviteLink = inviteLink.replace("team=white", "team=black")
    } else {
        inviteLink = inviteLink.replace("team=black", "team=white")
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink)
                 .then(() => setCopied(true))
                 .catch(err => alert("Error in copying text: " + err));
    };

    // https://dev.to/grafton-studio/native-tap-to-share-in-javascript-with-the-web-share-api-current-status-tips-and-limitations-4g4h
    const shareData = {
          title: "HiveMind",
          text: "You are challenged for a game of Hive!",
          url: inviteLink
        };
    const nativeShare = () => {
        navigator.share(shareData)
                 .then(() => setShared(true))
        .catch(err => alert("Error sharing: " + err));
    };

    if (navigator.share) {
       return (
            <Button size='tiny' color={shared ? 'grey' : 'black'} onClick={nativeShare}>
                    <Icon name='share alternate' />
                    {shared ? 'Shared' : 'Share the link'}
                </Button>
       )
    } else {
        return (
        <Button size='tiny' color={copied ? 'grey' : 'black'} onClick={copyToClipboard}>
                    <Icon name='copy' />
                    {copied ? 'Copied to clipboard' : 'Click to copy link'}
        </Button>
        )
    }
}
