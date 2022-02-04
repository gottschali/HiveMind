import WelcomeInsect from '../components/WelcomeInsect';

export default function AboutPage() {
    return <div>
            <WelcomeInsect />
            <iframe src="/README.html" title="Readme" style={{width: "100%", height: "100%", position: "absolute", border: "none"}} />
        </div>
}
