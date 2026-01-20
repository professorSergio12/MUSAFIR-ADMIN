import { useDispatch } from "react-redux";
import {
  fetchLatesReviews,
  fetchPopularPackages,
  fetchRecentBookings,
  fetchSummaryData,
} from "../api/Dashboard";
import {
  setDashboard,
  setLatestReviews,
  setPopularPackages,
  setRecentBooking,
} from "../redux/dashboardSlice";
import { useEffect } from "react";

export const useSummary = () => {
  const dispatch = useDispatch();
  const fetchDashboardData = async () => {
    const data = await fetchSummaryData();
    dispatch(setDashboard(data.data));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
};

export const useLatestReview = () => {
  const dispatch = useDispatch();
  const fetchDashboardData = async () => {
    const data = await fetchLatesReviews();
    console.log(data.data.data);
    dispatch(setLatestReviews(data.data.data.reviews));
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dispatch]);
};

export const useRecentBookings = () => {
  const dispatch = useDispatch();
  const fetchDashboardData = async () => {
    const data = await fetchRecentBookings();
    dispatch(setRecentBooking(data.data.recentBookings));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
};

export const useGetPopularBookings = () => {
  const dispatch = useDispatch();
  const fetchDashboardData = async () => {
    const data = await fetchPopularPackages();
    dispatch(setPopularPackages(data.data.data));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
};
