-- 005_return_flow_and_media.sql
-- Adds return condition tracking, item images, condition history, and notifications.

-- Update Loan: add return condition fields
ALTER TABLE public.loans ADD COLUMN IF NOT EXISTS return_condition TEXT;
ALTER TABLE public.loans ADD COLUMN IF NOT EXISTS return_notes TEXT;

-- Update LoanStatus CHECK constraint to include DAMAGED
ALTER TABLE public.loans DROP CONSTRAINT IF EXISTS loans_status_check;
ALTER TABLE public.loans ADD CONSTRAINT loans_status_check
  CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'RETURNED', 'OVERDUE', 'LOST', 'DAMAGED'));

-- Condition History
CREATE TABLE IF NOT EXISTS public.condition_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  loan_id UUID REFERENCES public.loans(id) ON DELETE SET NULL,
  previous_condition TEXT,
  new_condition TEXT NOT NULL,
  notes TEXT,
  changed_by_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.condition_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view condition history" ON public.condition_history;
CREATE POLICY "Anyone can view condition history" ON public.condition_history
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert condition history" ON public.condition_history;
CREATE POLICY "Admins can insert condition history" ON public.condition_history
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- Item Images
CREATE TABLE IF NOT EXISTS public.item_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  caption TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.item_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view item images" ON public.item_images;
CREATE POLICY "Anyone can view item images" ON public.item_images
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage item images" ON public.item_images;
CREATE POLICY "Admins can manage item images" ON public.item_images
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

CREATE INDEX IF NOT EXISTS idx_item_images_item_id ON public.item_images(item_id);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read);
