/* ════════════════════════════════════════════════════════════════════════
   INSIGHTS: English source copy. Every other language file mirrors this
   block structure exactly (same ids, same block types, same order); the
   test suite enforces it, so translations can never silently drift.
   Editorial rule: no em dashes, en dashes or minus signs, any language.
   ════════════════════════════════════════════════════════════════════════ */

export default {
  'why-ai-fails': {
    blocks: [
      { t: 'p', v: 'Almost every company we talk to has already tried AI. A pilot, a chatbot, a subscription for the whole team. A surprising number have nothing to show for it: no hours saved they can point to, no cost line that moved, no customer who noticed. Then the conclusion sets in that AI is overhyped.' },
      { t: 'p', v: 'It is not the model. The systems available today are far better than the work most companies are asking of them. The failures are almost always the same six, and every one of them is fixable.' },

      { t: 'h', v: '1. You bought a chatbot when you needed a job done' },
      { t: 'p', v: 'A chatbot answers. An agent finishes. The difference matters because a business does not have a shortage of answers, it has a backlog of unfinished work: calls not returned, quotes not sent, invoices not chased, tickets not triaged. If your AI produces text that a human then has to act on, you have added a step, not removed one.' },
      { t: 'p', v: 'The fix is to define the deliverable before the tool. Not "an AI assistant for the sales team" but "every inbound lead gets a qualified reply and a booked slot within four minutes, at any hour". That sentence is testable. "AI assistant" is not.' },

      { t: 'h', v: '2. It cannot touch the systems where work actually happens' },
      { t: 'p', v: 'An AI that cannot write to your CRM, your calendar, your database or your phone line is a suggestion engine. Nearly all of the value in automation sits on the write side, and that is exactly the side most pilots skip, because it needs real integration work, real permissions and a rollback story.' },
      { t: 'p', v: 'This is the single biggest split we see between projects that quietly die and projects that get renewed. Read-only AI is a demo. AI with scoped write access, an audit trail, and a human approval step where the stakes justify one, is a colleague.' },

      { t: 'h', v: '3. Nobody agreed what "working" means' },
      { t: 'p', v: 'Ask most teams how their AI pilot performed and you get impressions. It felt useful. It got something wrong once. Somebody in operations did not like it.' },
      { t: 'p', v: 'You cannot manage what you never measured. Before anything ships, capture the baseline: how many minutes per ticket today, what share of calls actually get answered, how long from lead to first reply, and what each of those costs you fully loaded. Then set the bar the agent has to clear, and build a small evaluation set of real cases with known-good outcomes so you can tell a regression from bad luck.' },
      { t: 'quote', v: 'A single hallucination kills a project that had no numbers. On a project that has them, it is just a bug report.' },

      { t: 'h', v: '4. The pilot was designed never to end' },
      { t: 'p', v: 'Pilots that run on synthetic data, in a sandbox, with no owner and no end date, are a way of looking busy without deciding anything. Six months later the tooling has moved on, the internal champion has changed jobs, and the work restarts from zero.' },
      { t: 'p', v: 'Give it a live slice instead. One team, one workflow, real data, real customers, four to six weeks, and a go or no-go at the end. A narrow thing in production teaches you more in two weeks than a broad thing in staging teaches you in two quarters.' },

      { t: 'h', v: '5. You automated a process that was already broken' },
      { t: 'p', v: 'AI is an amplifier. Point it at a workflow with unclear ownership, three sources of truth and a pile of undocumented exceptions, and you get wrong answers faster and at scale. The mess was being absorbed by human judgment, and automating the workflow is exactly what removes that judgment.' },
      { t: 'p', v: 'Where a process is genuinely broken, fix the process first or pick a different one. There is almost always a cleaner, more expensive, more repetitive workflow sitting next to it that would have been the better first target anyway.' },

      { t: 'h', v: "6. Nobody's job got easier, so nobody used it" },
      { t: 'p', v: 'Adoption is not a training problem. People use a tool when it removes work they hate, and quietly ignore it when it adds a review step to work they were already doing fine. If your agent needs a person to check its output every single time, you have hired an intern and handed the supervision job to your most expensive employee.' },
      { t: 'p', v: 'Aim the first build at work your team actively dislikes: after-hours calls, data entry, first-line triage, chasing documents. Adoption takes care of itself when the alternative is worse.' },

      { t: 'h', v: 'What the ones that work look like' },
      { t: 'p', v: 'The projects that pay for themselves are unglamorous, and they share a shape:' },
      { t: 'ol', v: [
        'One workflow, chosen because it is expensive, repetitive and measurable.',
        'A baseline number captured before anything is built.',
        'Write access to the real systems, scoped tightly, with an audit trail.',
        'A defined failure path: what the agent does when it is unsure, and who it escalates to.',
        'Live with real users inside weeks, not a demo held back for quarters.',
        'One accountable owner with the authority to kill it.',
      ] },
      { t: 'p', v: 'None of that is really about AI. It is ordinary delivery discipline, applied to a technology that people keep treating as an exception to it. That is the actual reason most companies get nothing back.' },
    ],
  },

  'ai-advantage': {
    blocks: [
      { t: 'p', v: 'There is a comfortable argument for waiting. The tools change every month, prices keep falling, and today\'s clever integration is next year\'s checkbox feature. Let someone else pay the tuition, then adopt the mature version. For most technologies that argument has been correct.' },
      { t: 'p', v: 'It is wrong here, and the reason is specific: almost none of the advantage lives in the model.' },

      { t: 'h', v: 'The model is the part you can buy later. Everything else is not.' },
      { t: 'p', v: 'A frontier model is a commodity, and a rented one. Your competitor can subscribe to the same model tomorrow, at the same price you pay. What they cannot subscribe to, on the day they decide to start, is any of this:' },
      { t: 'ul', v: [
        'Workflows already reshaped around what an agent can actually do.',
        'Clean, structured, reachable data, because two years of AI work forced the cleanup.',
        'Evaluation sets and guardrails built out of real production failures.',
        'A team that knows from experience where this works and where it does not.',
        'Customers who are already used to your response times.',
      ] },
      { t: 'p', v: 'Each of those took calendar time to build, not budget. That is what makes the gap compound instead of close.' },

      { t: 'h', v: 'The gap shows up in unit economics, not in press releases' },
      { t: 'p', v: 'Strip the language away and adopting AI well does one thing: it lowers the marginal cost of an operation, usually by a lot, and it removes the queue.' },
      { t: 'p', v: 'A competitor whose front desk answers every call at 2am, whose quotes go out in ninety seconds instead of two days, and whose support costs a fraction per ticket, is not winning because of technology. They are winning because they can now say yes to work you have to turn down, and charge less for it.' },
      { t: 'p', v: 'You will not see this as an announcement. You will see it as a slow, unexplained decline in win rate.' },
      { t: 'quote', v: 'Nobody loses to AI. They lose to a competitor whose response time went from two days to two minutes.' },

      { t: 'h', v: 'Waiting has a price, and it is measurable' },
      { t: 'p', v: 'The honest way to look at it is not "should we do AI". It is arithmetic. Take one workflow. Count what it costs today: hours, salary, error rate, deals lost to slow response. Multiply by the number of quarters you expect to wait. That is the invoice for the decision to wait, and it is usually larger than the build would have been.' },
      { t: 'p', v: 'Then add the part that never makes it onto the invoice: the process changes, the hiring and the data work you will be doing under time pressure later, while a competitor did it calmly now.' },

      { t: 'h', v: 'Being ahead does not mean being reckless' },
      { t: 'p', v: 'Ahead does not mean rewriting your company around a chatbot or signing a seven-figure platform contract. In practice it means:' },
      { t: 'ol', v: [
        'Picking one workflow a quarter and actually shipping it.',
        'Keeping the model layer swappable, because it will be swapped.',
        'Owning your data, your prompts and your evaluation sets, whoever builds them.',
        'Building institutional knowledge, not just a vendor relationship.',
        'Being willing to kill something that is not working, quickly and without drama.',
      ] },
      { t: 'p', v: 'That is a modest, unexciting programme. Run for two years it produces something a competitor cannot catch up on by writing a cheque, which is the entire point.' },

      { t: 'h', v: 'The window is narrower than it looks' },
      { t: 'p', v: 'Capability is commoditizing fast, and people read that as a reason to relax. It is the opposite. When everyone has the same models, the differentiator moves entirely to integration, proprietary process and data, and those are precisely the slow parts to build. The advantage available to a company that starts now is not a better model than its competitors will have. It is a two-year head start on everything the model plugs into.' },
    ],
  },
};
