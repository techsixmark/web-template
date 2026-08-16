-- 0007_security_fixes.sql
-- Fix: increment_discount_usage la SECURITY DEFINER nhung dang cho phep
-- anon/authenticated goi truc tiep qua PostgREST (/rest/v1/rpc/...), cho
-- phep bat ky ai tu tang used_count cua ma giam gia (pha lieu luong dung
-- gioi han) ma khong can dat don hang that. Chi service_role (server-side)
-- moi duoc goi RPC nay.

revoke execute on function increment_discount_usage(text) from public;
revoke execute on function increment_discount_usage(text) from anon;
revoke execute on function increment_discount_usage(text) from authenticated;
