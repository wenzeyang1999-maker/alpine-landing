-- Allen Zhang — PCMA Conference post
INSERT INTO blog_posts (url, title, excerpt, source, og_image, is_featured, published_at)
VALUES (
  'https://www.linkedin.com/posts/kaishen-allen-zhang_pcma-privatemarkets-ai-ugcPost-7466599456172527617-3ea8/',
  '"We''re not coders. We are lawyers and business people who embraced AI. You can too."',
  'That line from the PCMA Conference stuck with me. Most of the real value is not in the headline use cases — it is in the unglamorous work nobody wants to do twice. In alternatives due diligence, so much is still the back and forth, the scheduling, the same closed-ended questions asked across a dozen calls. At Alpine we have been chipping away at that end to end, trying to give people back the hours the process quietly takes from them.',
  'Founder Activity',
  'https://media.licdn.com/dms/image/v2/D4E22AQHjyAi1_sxRLQ/feedshare-image-high-res/B4EZ56wo3aKIAU-/0/1780176031639?e=2147483647&v=beta&t=HfPWghFU4Kda4Oc-c3WU6OpfWn3JsHx0EPunlzmX-5E',
  FALSE,
  now() - interval '8 days'
)
ON CONFLICT (url) DO NOTHING;
