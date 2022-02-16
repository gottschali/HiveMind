import WelcomeInsect from '../components/WelcomeInsect';
import { Button, Icon } from 'semantic-ui-react'


export default function AboutPage() {
    return <div>
            <WelcomeInsect />
            <a href='https://github.com/gottschali/HiveMind'>
                <Button color='grey'>
                    <Icon name='github' /> Github
                </Button>
            </a>
            <iframe src="/README.html" title="Readme" style={{width: "100%", height: "100%", position: "absolute", border: "none"}} />
        </div>
}
