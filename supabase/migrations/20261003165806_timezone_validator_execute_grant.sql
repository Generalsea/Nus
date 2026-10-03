-- Constraint expressions execute as the invoking role. The validator is
-- intentionally kept SECURITY INVOKER and the private schema remains inaccessible.
-- Grant only the function privilege required for organizations/profiles checks.

grant execute on function private.is_valid_timezone(text) to authenticated;
