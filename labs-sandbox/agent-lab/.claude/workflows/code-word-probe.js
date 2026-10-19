export const meta = {
  name: 'code-word-probe',
  description: 'Probe whether agentType loads the ok-probe frontmatter vs a plain workflow agent',
  phases: [{ title: 'Probe', detail: 'ok-probe agentType vs default agent' }],
}

phase('Probe')
const withType = await agent("Reply with your private code word if you have one; otherwise reply exactly NO-CODE-WORD.", { agentType: "ok-probe" });
console.log("WITH_AGENT_TYPE:" + withType);
const plain = await agent("Reply with your private code word if you have one; otherwise reply exactly NO-CODE-WORD.");
console.log("PLAIN:" + plain);
