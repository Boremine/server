import { authorizeConnections } from '../../utils/Socket/functions/validateConnection'

interface Constructor {
    prompt_id: string
    user_id: string
    verified: boolean
    body: {
        text: string
        username: string
        title: string
    }
    voting: {
        pops: number
        drops: number
    }
    countDown: number
    barColor: string
    fiveLatestPrompts: Array<string>
}

export class CurrentPrompt {
    prompt_id: string
    user_id: string
    verified: boolean
    body: { text: string; username: string, title: string }
    voting: { pops: number; drops: number }
    countDown: number
    majorityConnections: number
    barColor: string
    fixedConnections: number
    constructor ({
        prompt_id,
        user_id,
        verified,
        body,
        voting,
        countDown,
        barColor
    }: Constructor) {
        this.prompt_id = prompt_id
        this.user_id = user_id
        this.verified = verified
        this.body = body
        this.voting = voting
        this.countDown = countDown
        this.barColor = barColor
        this.fixedConnections = authorizeConnections.length

        const halfConnections = this.fixedConnections / 2

        if ((halfConnections) % 1 === 0) this.majorityConnections = halfConnections + 1
        else this.majorityConnections = Math.ceil(halfConnections)
    }

    public getPrompt = () => {
        const prompt = {
            body: this.body,
            countDown: this.countDown,
            verified: this.verified,
            voteScale: {
                pops: (this.voting.pops / this.majorityConnections) * 100,
                drops: (this.voting.drops / this.majorityConnections) * 100,
                scale: ((this.voting.pops - this.voting.drops) / this.majorityConnections) * 100
            },
            barColor: this.barColor
        }
        return prompt
    }

    public getPromptEmit = () => {
        const prompt = {
            countDown: this.countDown
        }
        return prompt
    }

    public updateCountDown = () => {
        this.countDown--
    }

    public getCountDown = () => {
        return this.countDown
    }

    public increasePops = () => {
        this.voting.pops++
    }

    public increaseDrops = () => {
        this.voting.drops++
    }

    public getVotingScale = () => {
        const voting = {
            pops: (this.voting.pops / this.majorityConnections) * 100,
            drops: (this.voting.drops / this.majorityConnections) * 100,
            scale: ((this.voting.pops - this.voting.drops) / this.majorityConnections) * 100
        }
        return voting
    }
}
