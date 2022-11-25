import Prompt from '../../../models/prompt'

export const checkIfFirstFive = async (prompt_id: string) => {
    const prompts = await Prompt.find().limit(5)
    let inFirstFive = false
    for (let i = 0; i < prompts.length; i++) {
        if (prompt_id.toString() === prompts[i]._id.toString()) {
            inFirstFive = true
            // user.prompt_id.promptInFirstFive = true
            break
        }
    }
    return inFirstFive
}
