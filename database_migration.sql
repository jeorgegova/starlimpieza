-- ===========================================
-- MIGRATION SCRIPT - Update existing database
-- Execute this in Supabase SQL Editor to migrate existing schema
-- ===========================================

-- Add user_id column to service_discount_config if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public'
                   AND table_name = 'service_discount_config'
                   AND column_name = 'user_id') THEN
        ALTER TABLE public.service_discount_config ADD COLUMN user_id uuid REFERENCES public.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Drop old unique constraint if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints
               WHERE table_schema = 'public'
               AND table_name = 'service_discount_config'
               AND constraint_name = 'service_discount_config_unique') THEN
        ALTER TABLE public.service_discount_config DROP CONSTRAINT service_discount_config_unique;
    END IF;
END $$;

-- Add new unique constraint
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints
                   WHERE table_schema = 'public'
                   AND table_name = 'service_discount_config'
                   AND constraint_name = 'service_discount_config_user_service_unique') THEN
        ALTER TABLE public.service_discount_config ADD CONSTRAINT service_discount_config_user_service_unique UNIQUE (user_id, service_type, services_required);
    END IF;
END $$;

-- Create new indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_service_discount_config_user_id ON public.service_discount_config(user_id);

-- Update existing records to have user_id = NULL (global configurations)
UPDATE public.service_discount_config SET user_id = NULL WHERE user_id IS NULL;

-- Add new RLS policies if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies
                   WHERE schemaname = 'public'
                   AND tablename = 'service_discount_config'
                   AND policyname = 'Users can view their own discount configurations') THEN
        CREATE POLICY "Users can view their own discount configurations" ON public.service_discount_config
            FOR SELECT USING (user_id = auth.uid());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies
                   WHERE schemaname = 'public'
                   AND tablename = 'service_discount_config'
                   AND policyname = 'Everyone can read global discount configurations') THEN
        CREATE POLICY "Everyone can read global discount configurations" ON public.service_discount_config
            FOR SELECT USING (user_id IS NULL);
    END IF;
END $$;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_customer_discounts(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_customer_completed_services(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_service_discount(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_customer_vip_tier(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION add_loyalty_points(uuid, text, integer) TO authenticated;

-- ===========================================
-- MIGRATION COMPLETE
-- =========================================--