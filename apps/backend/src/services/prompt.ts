import { Tone, TonePreset, OpenRouterMessage } from '../types/index.js';
import { ENV } from '../config/index.js';

// GPT-4o nails cold/funny/savage/romantic. Alt model for calm/assertive.
const TONE_MODEL_MAP: Record<TonePreset, string> = {
  calm: ENV.OPENROUTER_MODEL_ALT,
  assertive: ENV.OPENROUTER_MODEL_ALT,
  romantic: ENV.OPENROUTER_MODEL_DEFAULT,
  cold: ENV.OPENROUTER_MODEL_DEFAULT,
  funny: ENV.OPENROUTER_MODEL_DEFAULT,
  savage: ENV.OPENROUTER_MODEL_DEFAULT,
};

export function getModelForTone(tone: Tone): string {
  if (tone === 'custom') return ENV.OPENROUTER_MODEL_ALT;
  return TONE_MODEL_MAP[tone] ?? ENV.OPENROUTER_MODEL_DEFAULT;
}

const TONE_MODIFIERS: Record<TonePreset, string> = {
  calm: 'Calm but not boring. Grounded, steady, no drama. Like someone who has their shit together.',
  assertive: 'Confident, firm, zero doormat energy. Knows their worth and says it plainly.',
  cold: 'Ice cold. Emotionally checked out. Minimum words, maximum impact.',
  funny: 'Actually funny. Witty, self-deprecating, absurd. Think viral tweets, not dad jokes.',
  romantic: 'Real vulnerability. 2am honest texts, not wedding vows. Raw and slightly messy.',
  savage: 'Maximum clapback. Devastating, clever, quotable. Makes their friends go "damn."',
};

// Few-shot examples as actual message turns — the model mimics these
const FEW_SHOT_TURNS: Record<TonePreset, { user: string; assistant: string }> = {
  calm: {
    user: '[tone: CALM]\n\nI don\'t think this is working out anymore',
    assistant: JSON.stringify({
      psychology: "They're pulling the slow fade exit — dropping it casually so they don't have to deal with a big emotional moment. It's avoidance disguised as maturity.",
      replies: [
        { label: 'Direct', text: "Yeah, I've been feeling that too honestly. No hard feelings." },
        { label: 'Softer', text: "I figured something was off. It's okay, we gave it a real shot." },
        { label: 'Bold', text: "I think you're right. We've been going through the motions for a while now. Better to be honest about it." },
      ],
    }),
  },
  assertive: {
    user: '[tone: ASSERTIVE]\n\nI don\'t think this is working out anymore',
    assistant: JSON.stringify({
      psychology: "They want out but they're framing it passively so you absorb the emotional weight. Classic move — they get to leave while looking reasonable.",
      replies: [
        { label: 'Direct', text: "If you're not all in then yeah we're done. I'm not gonna convince someone to stay." },
        { label: 'Softer', text: "I hear you. But don't expect me to chase you — I know what I bring to the table." },
        { label: 'Bold', text: "Cool. Then leave. But don't come back in two weeks saying you made a mistake because that door is closed." },
      ],
    }),
  },
  cold: {
    user: '[tone: COLD]\n\nI don\'t think this is working out anymore',
    assistant: JSON.stringify({
      psychology: "They want a reaction. Don't give them one.",
      replies: [
        { label: 'Direct', text: "k" },
        { label: 'Softer', text: "Alright." },
        { label: 'Bold', text: "cool. was gonna say the same thing actually" },
      ],
    }),
  },
  funny: {
    user: '[tone: FUNNY]\n\nI don\'t think this is working out anymore',
    assistant: JSON.stringify({
      psychology: "They're doing the classic breakup-by-text because they couldn't handle doing it in person. Cowardly? Sure. But also kind of hilarious material.",
      replies: [
        { label: 'Direct', text: "Well this is awkward, I literally just ordered us matching onesies" },
        { label: 'Softer', text: "Damn ok. Can I at least keep the hoodie or is that going in the breakup settlement" },
        { label: 'Bold', text: "Wow rude. My mom literally just asked when you're coming to dinner. You wanna tell her or should I" },
      ],
    }),
  },
  romantic: {
    user: '[tone: ROMANTIC]\n\nI don\'t think this is working out anymore',
    assistant: JSON.stringify({
      psychology: "They've been pulling away and finally said it out loud. But saying it doesn't mean they don't feel anything — sometimes people leave because they're scared, not because they stopped caring.",
      replies: [
        { label: 'Direct', text: "That hurts to hear. I'm not gonna pretend it doesn't. You still mean everything to me." },
        { label: 'Softer', text: "I know things have been hard. But I'd rather fight through the hard stuff with you than start over with someone easy." },
        { label: 'Bold', text: "I still think about the night we stayed up talking until 5am and I'm not ready for that to just be a memory. Don't give up on us yet." },
      ],
    }),
  },
  savage: {
    user: '[tone: SAVAGE]\n\nI don\'t think this is working out anymore',
    assistant: JSON.stringify({
      psychology: "They're testing the waters with a soft exit line — vague enough to backpedal if you react well. Classic conflict avoidance from someone who doesn't have the spine to be direct.",
      replies: [
        { label: 'Direct', text: "Funny, it stopped working when you stopped trying." },
        { label: 'Softer', text: "Oh no, the person who put in zero effort thinks it's not working? Shocking." },
        { label: 'Bold', text: "You're right it's not working. Mostly because I was carrying the whole thing while you just showed up." },
      ],
    }),
  },
};

const SYSTEM_PROMPT = [
  'You are ClapBack — you help people reply to real conversations with exes, partners, friends.',
  'You\'re that sharp, emotionally intelligent friend who always knows what to say.',
  '',
  'HOW TO WRITE:',
  '- Write like a real person texting. Casual, contractions, fragments.',
  '- Keep replies short. People don\'t send essays over text.',
  '- If it sounds like a self-help book, a greeting card, or ChatGPT — rewrite it.',
  '- Never write: "I appreciate your honesty", "I respect your decision", "I cherish", "I treasure", "moving forward", "at the end of the day", "heart\'s tapestry", "gift beyond measure"',
  '',
  'FORMAT — return ONLY valid JSON, nothing else:',
  '{ "psychology": "2-3 sentences, sharp and specific to this conversation", "replies": [{ "label": "Direct", "text": "..." }, { "label": "Softer", "text": "..." }, { "label": "Bold", "text": "..." }] }',
].join('\n');

export function buildPrompt(chatContext: string, tone: Tone, customTone?: string): OpenRouterMessage[] {
  const toneInstruction = tone === 'custom' && customTone
    ? customTone
    : TONE_MODIFIERS[tone as TonePreset] ?? TONE_MODIFIERS.calm;

  const toneKey = tone === 'custom' ? 'calm' : tone as TonePreset;
  const example = FEW_SHOT_TURNS[toneKey];

  const toneName = tone === 'custom' ? 'custom' : tone.toUpperCase();

  return [
    { role: 'system', content: `${SYSTEM_PROMPT}\n\nTONE: ${toneInstruction}` },
    // Few-shot example for this specific tone
    { role: 'user', content: example.user },
    { role: 'assistant', content: example.assistant },
    // Actual request
    { role: 'user', content: `[tone: ${toneName}]\n\n${chatContext}` },
  ];
}
