export const meta = {
  name: "tools-skills-probe",
  description: "Lab probe: does the ok-probe agentType get the Bash tool and the lab-skill content?",
  phases: [{ title: "Probe" }],
};
phase("Probe");
const bash = await agent("Try to use the Bash tool to run: echo hi. If you cannot use Bash, reply exactly NO-BASH.", { agentType: "ok-probe" });
console.log("BASH_TEST:" + bash);
const skill = await agent("Without reading any files, what LAB PHRASE does your lab-skill contain? If you have no such skill content in your context, reply exactly NO-SKILL.", { agentType: "ok-probe" });
console.log("SKILL_TEST:" + skill);
