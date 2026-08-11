export default function DashboardFooter() {
  return (
    <footer className="border-t px-6 py-4">
      <p className="text-center text-sm text-default-500">
        © {new Date().getFullYear()} FundNest. All rights reserved.
      </p>
    </footer>
  );
}
